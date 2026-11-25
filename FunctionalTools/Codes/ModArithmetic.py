import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 1000000007

"""
 * Algoritmo : Exponenciación binaria, inverso modular y nCr
 * Problema  : CSES 1079 - Binomial Coefficients (https://cses.fi/problemset/task/1079)
 * Entrada   : t, luego t pares "a b"
 * Salida    : C(a, b) módulo 10^9 + 7
 * Complejidad: tiempo O(10^6 + t), memoria O(10^6)
"""


# fact[i] = i! y inv_fact[i] = inverso de i!, ambos módulo MOD
MAXN = 1000001


def binpow(a, b):
    res = 1
    a %= MOD
    while b > 0:
        if b & 1:
            res = res * a % MOD
        a = a * a % MOD
        b >>= 1
    return res


def mod_inv(a):
    return binpow(a, MOD - 2)


def main():
    # se precalculan factoriales e inversos en O(MAXN)
    fact = [1] * MAXN
    for i in range(1, MAXN):
        fact[i] = fact[i - 1] * i % MOD
    inv_fact = [1] * MAXN
    # inverso del último factorial con Fermat
    inv_fact[MAXN - 1] = mod_inv(fact[MAXN - 1])
    # los demás inversos salen de inv_fact[i-1] = inv_fact[i] * i
    for i in range(MAXN - 1, 0, -1):
        inv_fact[i - 1] = inv_fact[i] * i % MOD

    def nCr(n, k):
        if k < 0 or k > n:
            return 0
        return fact[n] * inv_fact[k] % MOD * inv_fact[n - k] % MOD

    t = int(input())
    out = []
    for _ in range(t):
        a, b = map(int, input().split())
        out.append(nCr(a, b))
    print("\n".join(map(str, out)))


main()
