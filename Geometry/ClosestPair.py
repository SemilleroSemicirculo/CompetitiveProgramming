import sys
import math
from bisect import bisect_left, insort

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Par de puntos más cercano (sweep line con set)
 * Problema  : CSES 2194 - Minimum Euclidean Distance (https://cses.fi/problemset/task/2194)
 * Entrada   : n, luego n puntos enteros "x y"
 * Salida    : el cuadrado de la mínima distancia euclidiana entre dos puntos
 * Complejidad: tiempo O(n log n), memoria O(n)
"""


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    # se ordenan los puntos por x
    p = sorted(zip(map(int, data[1:2 * n + 1:2]), map(int, data[2:2 * n + 2:2])))

    # puntos cercanos en x, ordenados por y (lista ordenada con bisect)
    active = []
    best = INF
    left = 0
    for i in range(n):
        x, y = p[i]
        d = math.isqrt(best) + 1 if best != INF else 4 * 10 ** 9
        # se sacan los puntos demasiado lejos en x
        while left < i and x - p[left][0] >= d:
            px, py = p[left]
            active.pop(bisect_left(active, (py, px)))
            left += 1
        # solo se revisan los puntos con y dentro de ±d (pocos por la franja)
        j = bisect_left(active, (y - d, -INF))
        while j < len(active) and active[j][0] <= y + d:
            qy, qx = active[j]
            dist = (x - qx) ** 2 + (y - qy) ** 2
            if dist < best:
                best = dist
            j += 1
        insort(active, (y, x))
    print(best)


main()
