import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Kadane (subarreglo de suma máxima)
 * Problema  : CSES 1643 - Maximum Subarray Sum (https://cses.fi/problemset/task/1643)
 * Entrada   : n, luego n enteros
 * Salida    : máxima suma de un subarreglo no vacío
 * Complejidad: tiempo O(n), memoria O(n)
"""
def main():
    n = int(input())
    a = list(map(int, input().split()))

    # best = mejor suma encontrada, curr = mejor suma de un subarreglo que termina en i
    best = curr = a[0]
    for i in range(1, n):
        # o se empieza un subarreglo nuevo en a[i] o se extiende el anterior
        curr = max(a[i], curr + a[i])
        # se guarda el mejor resultado global
        best = max(best, curr)
    print(best)


main()
