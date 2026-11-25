import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Conteo de formas con monedas (combinaciones y permutaciones)
 * Problema  : CSES 1636 - Coin Combinations II (https://cses.fi/problemset/task/1636)
 * Entrada   : n x, luego n valores de monedas
 * Salida    : cantidad de combinaciones (sin importar el orden) que suman x, módulo 10^9+7
 * Complejidad: tiempo O(n·x), memoria O(x)
"""
MODC = 1000000007  # este problema pide módulo 10^9+7


def main():
    n, x = map(int, input().split())
    coin = list(map(int, input().split()))

    # dp[s] = formas de sumar s
    dp = [0] * (x + 1)
    # hay una forma de sumar 0: no usar monedas
    dp[0] = 1
    # combinaciones: la moneda va en el bucle externo (el orden no importa)
    for c in coin:
        for s in range(c, x + 1):
            dp[s] = (dp[s] + dp[s - c]) % MODC
    # Para contar permutaciones (Coin Combinations I, CSES 1635) se invierten los bucles:
    # for s in 1..x: for c in coin: dp[s] += dp[s - c]
    print(dp[x])


main()
