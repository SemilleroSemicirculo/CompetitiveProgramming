import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Transformada teórica de números (NTT) módulo 998244353 (basado en KACTL, CC0)
 * Problema  : Library Checker - Convolution (https://judge.yosupo.jp/problem/convolution_mod)
 * Entrada   : N, M; a_0 … a_{N−1}; b_0 … b_{M−1} (valores menores que 998244353)
 * Salida    : c_0 … c_{N+M−2} con c_k = Σ a_i · b_{k−i} mód 998244353
 * Complejidad: tiempo O((N + M) log(N + M)), memoria O(N + M)
"""


def ntt(a, inv):
    n = len(a)
    j = 0
    for i in range(1, n):
        bit = n >> 1
        while j & bit:
            j ^= bit
            bit >>= 1
        j ^= bit
        if i < j:
            a[i], a[j] = a[j], a[i]
    length = 2
    while length <= n:
        w = pow(3, (MOD - 1) // length, MOD)
        if inv:
            w = pow(w, MOD - 2, MOD)
        half = length // 2
        ws = [1] * half                   # potencias de la raíz para este nivel
        for k in range(1, half):
            ws[k] = ws[k - 1] * w % MOD
        for i in range(0, n, length):
            for k in range(half):
                u = a[i + k]
                v = a[i + k + half] * ws[k] % MOD
                a[i + k] = (u + v) % MOD
                a[i + k + half] = (u - v) % MOD
        length <<= 1
    if inv:
        ni = pow(n, MOD - 2, MOD)
        for i in range(n):
            a[i] = a[i] * ni % MOD


def main():
    data = sys.stdin.buffer.read().split()
    N, M = int(data[0]), int(data[1])
    n = 1
    while n < N + M - 1:
        n <<= 1
    a = [int(x) for x in data[2:2 + N]] + [0] * (n - N)
    b = [int(x) for x in data[2 + N:2 + N + M]] + [0] * (n - M)
    ntt(a, False)
    ntt(b, False)
    c = [x * y % MOD for x, y in zip(a, b)]
    ntt(c, True)
    print(" ".join(map(str, c[:N + M - 1])))


main()
