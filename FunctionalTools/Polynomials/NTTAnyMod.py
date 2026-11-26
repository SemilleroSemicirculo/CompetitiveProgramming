import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Convolución con módulo arbitrario: NTT con tres primos y teorema chino del resto
 * Problema  : Library Checker - Convolution (mod 1,000,000,007) (https://judge.yosupo.jp/problem/convolution_mod_1000000007)
 * Entrada   : N, M; a_0 … a_{N−1}; b_0 … b_{M−1} (valores menores que 10^9 + 7)
 * Salida    : c_k = Σ a_i · b_{k−i} mód 10^9 + 7, para k = 0 … N + M − 2
 * Complejidad: tiempo O((N + M) log(N + M)) (tres NTT por factor), memoria O(N + M)
"""


def ntt(a, inv, p, g):
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
        w = pow(g, (p - 1) // length, p)
        if inv:
            w = pow(w, p - 2, p)
        half = length // 2
        ws = [1] * half
        for k in range(1, half):
            ws[k] = ws[k - 1] * w % p
        for i in range(0, n, length):
            for k in range(half):
                u = a[i + k]
                v = a[i + k + half] * ws[k] % p
                a[i + k] = (u + v) % p
                a[i + k + half] = (u - v) % p
        length <<= 1
    if inv:
        ni = pow(n, p - 2, p)
        for i in range(n):
            a[i] = a[i] * ni % p


def conv(a, b, p, n):
    fa = [x % p for x in a] + [0] * (n - len(a))
    fb = [x % p for x in b] + [0] * (n - len(b))
    ntt(fa, False, p, 3)
    ntt(fb, False, p, 3)
    fc = [x * y % p for x, y in zip(fa, fb)]
    ntt(fc, True, p, 3)
    return fc


def main():
    data = sys.stdin.buffer.read().split()
    N, M = int(data[0]), int(data[1])
    a = [int(x) for x in data[2:2 + N]]
    b = [int(x) for x in data[2 + N:2 + N + M]]
    n = 1
    while n < N + M - 1:
        n <<= 1
    P1, P2, P3 = 998244353, 167772161, 469762049
    r1, r2, r3 = conv(a, b, P1, n), conv(a, b, P2, n), conv(a, b, P3, n)
    Q = 10 ** 9 + 7
    i12 = pow(P1, P2 - 2, P2)
    i123 = pow(P1 * P2 % P3, P3 - 2, P3)
    out = []
    for k in range(N + M - 1):
        t = (r2[k] - r1[k]) * i12 % P2
        x12 = r1[k] + P1 * t
        u = (r3[k] - x12) * i123 % P3
        out.append((x12 + P1 * P2 * u) % Q)   # Python maneja el entero exacto
    print(" ".join(map(str, out)))


main()
