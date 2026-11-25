import sys
from itertools import accumulate

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Sumas de prefijos en 2D
 * Problema  : CSES 1652 - Forest Queries (https://cses.fi/problemset/task/1652)
 * Entrada   : n q, n filas con '.' (vacío) y '*' (árbol), luego q consultas "y1 x1 y2 x2"
 * Salida    : cantidad de árboles en cada rectángulo
 * Complejidad: tiempo O(n^2 + q), memoria O(n^2)
"""


def main():
    data = sys.stdin.buffer.read().split()
    n, q = int(data[0]), int(data[1])
    # p[i][j] = árboles en el rectángulo (1,1)-(i,j); se arma fila por fila
    p = [[0] * (n + 1)]
    for i in range(n):
        row = data[2 + i]
        # prefijo de la fila (42 es el código de '*') sumado a la fila de arriba
        acc = accumulate(c == 42 for c in row)
        p.append([0] + [a + b for a, b in zip(acc, p[-1][1:])])
    qs = list(map(int, data[2 + n:]))
    out = []
    for k in range(0, 4 * q, 4):
        y1, x1, y2, x2 = qs[k], qs[k + 1], qs[k + 2], qs[k + 3]
        out.append(p[y2][x2] - p[y1 - 1][x2] - p[y2][x1 - 1] + p[y1 - 1][x1 - 1])
    print('\n'.join(map(str, out)))


main()
