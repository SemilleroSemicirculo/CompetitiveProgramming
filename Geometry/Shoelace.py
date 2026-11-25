import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Fórmula del Shoelace (área de un polígono)
 * Problema  : CSES 2191 - Polygon Area (https://cses.fi/problemset/task/2191)
 * Entrada   : n, luego n vértices "x y" en orden
 * Salida    : el doble del área del polígono (entero)
 * Complejidad: tiempo O(n), memoria O(n)
"""


def main():
    n = int(input())
    points = [tuple(map(int, input().split())) for _ in range(n)]

    res = 0
    for i in range(n):
        # término x_i * (y_{i+1} - y_{i-1}) de la fórmula del Shoelace (índices circulares)
        res += points[i][0] * (points[(i + 1) % n][1] - points[i - 1][1])

    # esto da 2 veces el área
    print(abs(res))


main()
