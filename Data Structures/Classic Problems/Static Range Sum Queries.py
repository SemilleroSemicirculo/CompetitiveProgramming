import sys
from itertools import accumulate

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Sumas de prefijos
 * Problema  : CSES 1646 - Static Range Sum Queries (https://cses.fi/problemset/task/1646)
 * Entrada   : n q, n enteros, luego q consultas "a b"
 * Salida    : la suma de cada rango [a, b]
 * Complejidad: tiempo O(n + q), memoria O(n)
"""


def main():
    data = sys.stdin.buffer.read().split()
    n, q = int(data[0]), int(data[1])
    # p[i] = x_1 + ... + x_i, con p[0] = 0
    p = [0] + list(accumulate(map(int, data[2:2 + n])))
    qs = data[2 + n:]
    # la suma de [a, b] es p[b] - p[a-1]
    out = [p[int(qs[2 * i + 1])] - p[int(qs[2 * i]) - 1] for i in range(q)]
    print('\n'.join(map(str, out)))


main()
