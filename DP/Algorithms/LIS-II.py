import sys
from bisect import bisect_left

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : LIS con búsqueda binaria
 * Problema  : CSES 1145 - Increasing Subsequence (https://cses.fi/problemset/task/1145)
 * Entrada   : n, luego n enteros
 * Salida    : longitud de la subsecuencia creciente más larga
 * Complejidad: tiempo O(n log n), memoria O(n)
"""
def main():
    n = int(input())
    a = list(map(int, input().split()))

    # R[k] = menor valor final posible de una LIS de longitud k+1 (siempre ordenado)
    R = []
    for v in a:
        # primer lugar de R con valor >= v (búsqueda binaria)
        ind = bisect_left(R, v)
        if ind == len(R):
            # v es mayor que todos: la LIS crece
            R.append(v)
        else:
            # v reemplaza un final más grande para dejar más espacio a futuro
            R[ind] = v
    # el tamaño de R es la longitud de la LIS
    print(len(R))


main()
