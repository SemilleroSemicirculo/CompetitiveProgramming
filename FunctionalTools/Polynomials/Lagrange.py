import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Interpolación de Lagrange en puntos consecutivos (evaluar un polinomio de grado k en O(k))
 * Problema  : Codeforces 622F - The Sum of the k-th Powers (https://codeforces.com/problemset/problem/622/F)
 * Entrada   : n k (1 ≤ n ≤ 10^9, 0 ≤ k ≤ 10^6)
 * Salida    : 1^k + 2^k + … + n^k módulo 10^9 + 7
 * Complejidad: tiempo O(k log P), memoria O(k)
"""

P = 10 ** 9 + 7


def main():
    n, k = map(int, input().split())
    d = k + 2
    y = [0] * d
    for x in range(1, d):
        y[x] = (y[x - 1] + pow(x, k, P)) % P
    if n < d:
        print(y[n])
        return
    pre = [1] * (d + 1)
    suf = [1] * (d + 1)
    for j in range(d):
        pre[j + 1] = pre[j] * ((n - j) % P) % P
    for j in range(d - 1, -1, -1):
        suf[j] = suf[j + 1] * ((n - j) % P) % P
    fact = [1] * d
    for i in range(1, d):
        fact[i] = fact[i - 1] * i % P
    inv_fact = [1] * d                    # inversos de factoriales en O(d)
    inv_fact[d - 1] = pow(fact[d - 1], P - 2, P)
    for i in range(d - 1, 0, -1):
        inv_fact[i - 1] = inv_fact[i] * i % P
    res = 0
    for i in range(d):
        t = y[i] * pre[i] % P * suf[i + 1] % P * inv_fact[i] % P * inv_fact[d - 1 - i] % P
        res = (res - t) % P if (d - 1 - i) % 2 else (res + t) % P
    print(res)


main()
