import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Esperanza como fracción p/q módulo primo (inversos modulares)
 * Problema  : Codeforces 1265E - Beautiful Mirrors (https://codeforces.com/problemset/problem/1265/E)
 * Entrada   : n, luego p_1 … p_n (el espejo i dice "sí" con probabilidad p_i/100)
 * Salida    : días esperados hasta que los n espejos digan "sí" seguidos, como p · q^(−1) mód 998244353
 * Complejidad: tiempo O(n + log M), memoria O(1)
"""


def main():
    n = int(input())
    ps = list(map(int, input().split()))
    # E = (1 + q1 + q1·q2 + … + q1⋯q_{n−1}) / (q1⋯qn), con q_i = p_i/100
    inv100 = pow(100, MOD - 2, MOD)
    num, prod = 0, 1
    for p in ps:
        num = (num + prod) % MOD          # suma 1, q1, q1·q2, ...
        prod = prod * p % MOD * inv100 % MOD
    # dividir módulo primo = multiplicar por el inverso (Fermat)
    print(num * pow(prod, MOD - 2, MOD) % MOD)


main()
