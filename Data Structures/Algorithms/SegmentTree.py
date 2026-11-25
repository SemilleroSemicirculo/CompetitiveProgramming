import sys

input = sys.stdin.readline
sys.setrecursionlimit(1 << 25)
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Segment Tree con propagación perezosa (suma de rango, asignación y suma de rango)
 * Problema  : CSES 1735 - Range Updates and Sums (https://cses.fi/problemset/task/1735)
 * Entrada   : n q, n enteros, luego q consultas: "1 a b x" (suma x), "2 a b x" (asigna x) o "3 a b" (consulta suma)
 * Salida    : la suma de cada consulta de tipo 3
 * Complejidad: tiempo O((n + q) log n), memoria O(n)
"""


# Segment Tree con propagación perezosa: suma[] guarda la suma de cada nodo
# y cada nodo puede tener pendiente "asignar setv" (si has_set) y luego "sumar add"
class SegmentTree:
    def __init__(self, a):
        self.n = n = len(a)
        self.suma = [0] * (4 * n)
        self.size = [0] * (4 * n)
        self.has_set = [False] * (4 * n)
        self.setv = [0] * (4 * n)
        self.add = [0] * (4 * n)
        self.build(a, 1, 0, n - 1)

    # construye el árbol recursivamente
    def build(self, a, i, l, r):
        self.size[i] = r - l + 1
        if l == r:
            self.suma[i] = a[l]
            return
        m = (l + r) // 2
        self.build(a, 2 * i, l, m)
        self.build(a, 2 * i + 1, m + 1, r)
        self.suma[i] = self.suma[2 * i] + self.suma[2 * i + 1]

    # aplica una actualización a un nodo y la deja pendiente para sus hijos
    def apply(self, i, is_set, value, add):
        if is_set:
            self.suma[i] = value * self.size[i]
            self.has_set[i], self.setv[i], self.add[i] = True, value, 0
        self.suma[i] += add * self.size[i]
        self.add[i] += add

    # empuja la actualización pendiente a los hijos
    def propagate(self, i):
        if self.has_set[i] or self.add[i]:
            for c in (2 * i, 2 * i + 1):
                self.apply(c, self.has_set[i], self.setv[i], self.add[i])
            self.has_set[i], self.add[i] = False, 0

    # actualiza el rango [lo, hi]
    def update(self, i, l, r, lo, hi, is_set, value, add):
        if r < lo or l > hi:
            return
        if lo <= l and r <= hi:
            self.apply(i, is_set, value, add)
            return
        self.propagate(i)
        m = (l + r) // 2
        self.update(2 * i, l, m, lo, hi, is_set, value, add)
        self.update(2 * i + 1, m + 1, r, lo, hi, is_set, value, add)
        self.suma[i] = self.suma[2 * i] + self.suma[2 * i + 1]

    # suma en el rango [lo, hi]
    def query(self, i, l, r, lo, hi):
        if r < lo or l > hi:
            return 0
        if lo <= l and r <= hi:
            return self.suma[i]
        self.propagate(i)
        m = (l + r) // 2
        return self.query(2 * i, l, m, lo, hi) + self.query(2 * i + 1, m + 1, r, lo, hi)


def main():
    n, q = map(int, input().split())
    a = list(map(int, input().split()))
    tree = SegmentTree(a)
    out = []
    for _ in range(q):
        t = list(map(int, input().split()))
        l, r = t[1] - 1, t[2] - 1
        if t[0] == 1:
            tree.update(1, 0, n - 1, l, r, False, 0, t[3])
        elif t[0] == 2:
            tree.update(1, 0, n - 1, l, r, True, t[3], 0)
        else:
            out.append(tree.query(1, 0, n - 1, l, r))
    print("\n".join(map(str, out)))


main()
