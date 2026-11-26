import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Transformada rápida de Fourier (FFT) para multiplicar polinomios (basado en KACTL, CC0)
 * Problema  : CSES 2112 - Apples and Bananas (https://cses.fi/problemset/task/2112)
 * Entrada   : k, n, m; los pesos de n manzanas y de m bananos (entre 1 y k)
 * Salida    : para cada peso w = 2 … 2k, cuántos pares (manzana, banano) pesan w en total
 * Complejidad: tiempo O(k log k), memoria O(k)
"""
import cmath


def fft(a, inv):
    n = len(a)
    j = 0
    for i in range(1, n):                 # permutación por inversión de bits
        bit = n >> 1
        while j & bit:
            j ^= bit
            bit >>= 1
        j ^= bit
        if i < j:
            a[i], a[j] = a[j], a[i]
    sgn = -1 if inv else 1
    rt = [cmath.exp(sgn * 2j * cmath.pi * i / n) for i in range(n // 2)]
    length = 2
    while length <= n:
        half, step = length // 2, n // length
        for i in range(0, n, length):
            for k in range(half):
                u = a[i + k]
                v = a[i + k + half] * rt[step * k]
                a[i + k] = u + v
                a[i + k + half] = u - v
        length <<= 1


def multiply(a, b):
    need = len(a) + len(b) - 1
    n = 1
    while n < need:
        n <<= 1
    fa = [complex(x) for x in a] + [0j] * (n - len(a))
    fb = [complex(x) for x in b] + [0j] * (n - len(b))
    fft(fa, False)
    fft(fb, False)
    fa = [x * y for x, y in zip(fa, fb)]
    fft(fa, True)
    return [round(fa[i].real / n) for i in range(need)]


def main():
    data = sys.stdin.buffer.read().split()
    k, n, m = int(data[0]), int(data[1]), int(data[2])
    A = [0] * (k + 1)
    B = [0] * (k + 1)
    for w in data[3:3 + n]:
        A[int(w)] += 1
    for w in data[3 + n:3 + n + m]:
        B[int(w)] += 1
    C = multiply(A, B)
    print(" ".join(map(str, C[2:2 * k + 1])))


main()
