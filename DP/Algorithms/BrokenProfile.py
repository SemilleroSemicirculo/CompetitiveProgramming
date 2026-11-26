import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : DP de perfil roto (llenar celda por celda guardando una máscara de la frontera)
 * Problema  : CSES 2181 - Counting Tilings (https://cses.fi/problemset/task/2181)
 * Entrada   : n m (1 ≤ n ≤ 10, 1 ≤ m ≤ 1000)
 * Salida    : la cantidad de formas de cubrir una cuadrícula n × m con fichas 1 × 2 y 2 × 1, módulo 10^9 + 7
 * Complejidad: tiempo O(n · m · 2^n), memoria O(2^n)
"""


def main():
    n, m = map(int, sys.stdin.readline().split())
    M7 = 10**9 + 7
    S = 1 << n
    dp = [0] * S
    dp[0] = 1
    for _ in range(m):
        for r in range(n):
            nd = [0] * S
            b = 1 << r
            b2 = 1 << (r + 1)
            for mask in range(S):
                v = dp[mask]
                if not v:
                    continue
                if mask & b:
                    nd[mask ^ b] += v
                    continue
                nd[mask | b] += v
                if r + 1 < n and not mask & b2:
                    nd[mask | b2] += v
            dp = [x % M7 for x in nd]
    print(dp[0])


main()
