import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Optimización de Knuth para DP de intervalos (opt[i][j−1] ≤ opt[i][j] ≤ opt[i+1][j])
 * Problema  : CSES 2088 - Knuth Division (https://cses.fi/problemset/task/2088)
 * Entrada   : n; el arreglo x_1 … x_n
 * Salida    : el costo mínimo de partir el arreglo en n piezas, si partir un tramo cuesta su suma
 * Complejidad: tiempo O(n²), memoria O(n²)
"""


def main():
    n = int(input())
    pre = [0]
    for x in map(int, input().split()):
        pre.append(pre[-1] + x)
    dp = [[0] * (n + 2) for _ in range(n + 2)]
    opt = [[0] * (n + 2) for _ in range(n + 2)]
    for i in range(1, n + 1):
        opt[i][i] = i
    for length in range(2, n + 1):
        for i in range(1, n - length + 2):
            j = i + length - 1
            di = dp[i]
            best, bc = INF, opt[i][j - 1]
            for c in range(opt[i][j - 1], min(j - 1, opt[i + 1][j]) + 1):
                v = di[c] + dp[c + 1][j]
                if v < best:
                    best, bc = v, c
            dp[i][j] = best + pre[j] - pre[i - 1]
            opt[i][j] = bc
    print(dp[1][n])


main()
