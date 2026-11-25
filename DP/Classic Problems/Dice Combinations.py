import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : DP de conteo (formas de formar una suma)
 * Problema  : CSES 1633 - Dice Combinations (https://cses.fi/problemset/task/1633)
 * Entrada   : un entero n
 * Salida    : número de formas de sumar n lanzando un dado una o más veces, módulo 10^9+7
 * Complejidad: tiempo O(n), memoria O(n)
"""

M = 10**9 + 7


def main():
    n = int(input())
    # dp[s] = formas de llegar exactamente a la suma s; dp[0] = 1 (no lanzar)
    dp = [0] * (n + 1)
    dp[0] = 1
    # ventana = dp[s-1] + ... + dp[s-6], se actualiza en O(1) por paso
    window = 0
    for s in range(1, n + 1):
        window += dp[s - 1]
        if s > 6:
            window -= dp[s - 7]
        window %= M
        dp[s] = window
    print(dp[n])


main()
