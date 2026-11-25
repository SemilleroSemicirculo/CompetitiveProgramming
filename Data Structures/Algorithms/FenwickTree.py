import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Fenwick Tree (BIT)
 * Problema  : CSES 1648 - Dynamic Range Sum Queries (https://cses.fi/problemset/task/1648)
 * Entrada   : n q, n enteros, luego q consultas: "1 k u" (a[k] = u) o "2 a b" (suma)
 * Salida    : la suma de cada consulta de tipo 2
 * Complejidad: tiempo O((n + q) log n), memoria O(n)
"""


# Fenwick Tree (BIT): bit[i] guarda la suma de un bloque de tamaño (i & -i) que termina en i
class Fenwick:
    def __init__(self, n):
        self.n = n
        self.bit = [0] * (n + 1)

    # suma v a la posición i (base 1)
    def add(self, i, v):
        while i <= self.n:
            self.bit[i] += v
            i += i & -i

    # suma del prefijo [1..i]
    def query(self, i):
        res = 0
        while i > 0:
            res += self.bit[i]
            i -= i & -i
        return res


def main():
    n, q = map(int, input().split())
    # a[] se guarda aparte para saber cuánto cambiar al actualizar
    a = [0] + list(map(int, input().split()))
    fw = Fenwick(n)
    for i in range(1, n + 1):
        fw.add(i, a[i])

    out = []
    for _ in range(q):
        t, x, y = map(int, input().split())
        if t == 1:
            # una asignación es sumar la diferencia
            fw.add(x, y - a[x])
            a[x] = y
        else:
            out.append(fw.query(y) - fw.query(x - 1))
    print("\n".join(map(str, out)))


main()
