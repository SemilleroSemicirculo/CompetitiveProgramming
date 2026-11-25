import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : LIS con DP cuadrática
 * Problema  : CSES 1145 - Increasing Subsequence (https://cses.fi/problemset/task/1145) (da TLE con n = 2·10^5; sirve para n <= 5000)
 * Entrada   : n, luego n enteros
 * Salida    : longitud de la subsecuencia creciente más larga
 * Complejidad: tiempo O(n^2), memoria O(n)
"""
def main():
    n = int(input())
    a = list(map(int, input().split()))

    # DP[i] = longitud de la LIS que termina en a[i]
    DP = [1] * n
    for i in range(n):
        # se prueba extender cada subsecuencia anterior más pequeña
        for j in range(i):
            if a[j] < a[i] and DP[j] + 1 > DP[i]:
                # a[i] se agrega al final de la LIS que termina en a[j]
                DP[i] = DP[j] + 1
    # la respuesta es el mejor DP[i] (O(n^2), lento para n grande)
    print(max(DP))


main()
