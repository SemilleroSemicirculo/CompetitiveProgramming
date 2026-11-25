import sys
import math

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Teorema de Pick (puntos enteros de un polígono)
 * Problema  : CSES 2193 - Polygon Lattice Points (https://cses.fi/problemset/task/2193)
 * Entrada   : n, luego n vértices enteros en orden
 * Salida    : puntos enteros interiores y puntos enteros en el borde
 * Complejidad: tiempo O(n log C), memoria O(n)
"""


def main():
    n = int(input())
    p = [tuple(map(int, input().split())) for _ in range(n)]

    # area2 = 2 * área
    area2 = boundary = 0
    for i in range(n):
        x1, y1 = p[i]
        x2, y2 = p[(i + 1) % n]
        # Shoelace: suma de x1*y2 - x2*y1
        area2 += x1 * y2 - x2 * y1
        # puntos enteros en cada arista = gcd(|dx|, |dy|)
        boundary += math.gcd(abs(x2 - x1), abs(y2 - y1))
    area2 = abs(area2)

    # de Pick: A = I + B/2 - 1  =>  I = (2A - B + 2) / 2
    print((area2 - boundary + 2) // 2, boundary)


main()
