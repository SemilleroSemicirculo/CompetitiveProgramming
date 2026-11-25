import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Segment Tree de máximos con descenso (primer elemento ≥ x)
 * Problema  : CSES 1143 - Hotel Queries (https://cses.fi/problemset/task/1143)
 * Entrada   : n m, cuartos libres de cada hotel, luego los cuartos que pide cada grupo
 * Salida    : el primer hotel con espacio suficiente para cada grupo (o 0)
 * Complejidad: tiempo O((n + m) log n), memoria O(n)
"""


def main():
    data = sys.stdin.buffer.read().split()
    n, m = int(data[0]), int(data[1])
    sz = 1
    while sz < n:
        sz <<= 1
    # t[v] = máximo de cuartos libres en el tramo del nodo v
    t = [0] * (2 * sz)
    t[sz:sz + n] = map(int, data[2:2 + n])
    for v in range(sz - 1, 0, -1):
        a, b = t[2 * v], t[2 * v + 1]
        t[v] = a if a > b else b
    out = []
    for r in map(int, data[2 + n:2 + n + m]):
        # si ni el máximo alcanza, ningún hotel sirve
        if t[1] < r:
            out.append(0)
            continue
        # se baja por el hijo izquierdo si alcanza: así se encuentra el primero
        v = 1
        while v < sz:
            v <<= 1
            if t[v] < r:
                v += 1
        out.append(v - sz + 1)
        # se ocupan los cuartos y se recalcula el camino a la raíz
        t[v] -= r
        v >>= 1
        while v:
            a, b = t[2 * v], t[2 * v + 1]
            t[v] = a if a > b else b
            v >>= 1
    print(*out)


main()
