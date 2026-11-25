import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Segment Tree iterativo (mínimo de rango y actualización puntual)
 * Problema  : CSES 1649 - Dynamic Range Minimum Queries (https://cses.fi/problemset/task/1649)
 * Entrada   : n q, n enteros, luego q consultas: "1 k u" (a[k] = u) o "2 a b" (mínimo en [a, b])
 * Salida    : el mínimo de cada consulta de tipo 2
 * Complejidad: tiempo O((n + q) log n), memoria O(n)
"""


# árbol iterativo: las hojas están en t[n..2n) y cada padre guarda el mínimo de sus hijos
class SegmentTree:
    def __init__(self, a):
        self.n = n = len(a)
        self.t = [INF] * n + a
        for i in range(n - 1, 0, -1):
            self.t[i] = min(self.t[2 * i], self.t[2 * i + 1])

    # se cambia la hoja y se recalcula hacia la raíz
    def update(self, p, value):
        t = self.t
        p += self.n
        t[p] = value
        while p > 1:
            p >>= 1
            t[p] = min(t[2 * p], t[2 * p + 1])

    # mínimo en [l, r): se sube juntando los nodos que cubren el rango
    def query(self, l, r):
        t = self.t
        res = INF
        l += self.n
        r += self.n
        while l < r:
            if l & 1:
                res = min(res, t[l])
                l += 1
            if r & 1:
                r -= 1
                res = min(res, t[r])
            l >>= 1
            r >>= 1
        return res


def main():
    n, q = map(int, input().split())
    a = list(map(int, input().split()))
    tree = SegmentTree(a)
    out = []
    for _ in range(q):
        t, x, y = map(int, input().split())
        if t == 1:
            tree.update(x - 1, y)
        else:
            out.append(tree.query(x - 1, y))
    print("\n".join(map(str, out)))


main()
