import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Factorización de Lyndon (algoritmo de Duval)
 * Problema  : Library Checker - Lyndon Factorization (https://judge.yosupo.jp/problem/lyndon_factorization)
 * Entrada   : una cadena S de minúsculas
 * Salida    : 0 = a_0 < a_1 < … < a_k = |S| tales que S[a_i, a_{i+1}) son palabras de Lyndon no crecientes
 * Complejidad: tiempo O(|S|), memoria O(1) extra
"""


def main():
    s = sys.stdin.readline().strip()
    n, i = len(s), 0
    cortes = [0]
    while i < n:
        j, k = i + 1, i
        while j < n and s[k] <= s[j]:
            k = i if s[k] < s[j] else k + 1
            j += 1
        while i <= k:
            i += j - k
            cortes.append(i)
    print(" ".join(map(str, cortes)))


main()
