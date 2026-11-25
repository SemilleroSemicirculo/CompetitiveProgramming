import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : DP de monedas (mínimo número de monedas)
 * Problema  : CSES 1634 - Minimizing Coins (https://cses.fi/problemset/task/1634)
 * Entrada   : n x, luego n monedas
 * Salida    : mínimo de monedas para sumar x, o -1
 * Complejidad: tiempo O(n·x), memoria O(x)
"""


def main():
    n, x = map(int, input().split())
    coins = list(map(int, input().split()))

    # dp[s] = mínimo de monedas para sumar s (x + 1 hace de infinito)
    BIG = x + 1
    dp = [BIG] * (x + 1)
    dp[0] = 0
    for c in coins:
        # cada moneda se puede usar muchas veces (mochila no acotada)
        for s in range(c, x + 1):
            t = dp[s - c] + 1
            if t < dp[s]:
                dp[s] = t

    # si dp[x] sigue en BIG no hay forma de formarlo
    print(-1 if dp[x] == BIG else dp[x])


main()
