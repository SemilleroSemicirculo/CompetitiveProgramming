import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Berlekamp-Massey: la recurrencia lineal más corta de una secuencia (basado en KACTL, CC0)
 * Problema  : Library Checker - Find Linear Recurrence (https://judge.yosupo.jp/problem/find_linear_recurrence)
 * Entrada   : N; luego a_0 … a_{N−1} (valores menores que 998244353)
 * Salida    : d y luego c_1 … c_d con a_i = c_1·a_{i−1} + … + c_d·a_{i−d} (mód 998244353)
 * Complejidad: tiempo O(N²), memoria O(N)
"""


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    s = [int(x) for x in data[1:1 + n]]
    C = [0] * (n + 1)
    B = [0] * (n + 1)
    C[0] = B[0] = 1
    L = m = 0
    b = 1
    for i in range(n):
        m += 1
        d = s[i]
        for j in range(1, L + 1):
            d += C[j] * s[i - j]
        d %= MOD
        if not d:
            continue
        T = C[:]
        coef = d * pow(b, MOD - 2, MOD) % MOD
        for j in range(m, n + 1):
            C[j] = (C[j] - coef * B[j - m]) % MOD
        if 2 * L > i:
            continue
        L, B, b, m = i + 1 - L, T, d, 0
    print(L)
    print(" ".join(str((MOD - C[j]) % MOD) for j in range(1, L + 1)))


main()
