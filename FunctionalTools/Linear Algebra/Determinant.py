import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Determinante módulo un primo con eliminación de Gauss
 * Problema  : Library Checker - Determinant of Matrix (https://judge.yosupo.jp/problem/matrix_det)
 * Entrada   : N; luego la matriz N × N con valores en [0, 998244353)
 * Salida    : el determinante módulo 998244353
 * Complejidad: tiempo O(N³), memoria O(N²)
"""


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    a = [[int(x) for x in data[1 + i * n:1 + (i + 1) * n]] for i in range(n)]
    det = 1
    for c in range(n):
        piv = next((i for i in range(c, n) if a[i][c]), -1)
        if piv == -1:
            print(0)
            return
        if piv != c:
            a[piv], a[c] = a[c], a[piv]
            det = -det % MOD
        det = det * a[c][c] % MOD
        inv = pow(a[c][c], MOD - 2, MOD)
        ac = a[c]
        for i in range(c + 1, n):
            f = a[i][c] * inv % MOD
            if f:
                ai = a[i]
                for j in range(c, n):
                    ai[j] = (ai[j] - f * ac[j]) % MOD
    print(det)


main()
