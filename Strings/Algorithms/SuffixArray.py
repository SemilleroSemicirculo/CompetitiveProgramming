import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Suffix Array (duplicación de prefijos) + LCP de Kasai
 * Problema  : CSES 2105 - Distinct Substrings (https://cses.fi/problemset/task/2105)
 * Entrada   : una cadena s
 * Salida    : cantidad de subcadenas distintas de s
 * Complejidad: tiempo O(n log^2 n), memoria O(n)
"""


# sa = sufijos ordenados; rnk[i] = posición del sufijo i en ese orden
def suffix_array(s):
    n = len(s)
    sa = list(range(n))
    rnk = [ord(c) for c in s]
    k = 1
    # duplicación de prefijos: se ordena por los primeros k y luego 2k caracteres
    while True:
        # la clave codifica el par (rnk[i], rnk[i+k]); la base debe superar a todo rango posible
        base = max(rnk) + 2
        key = [rnk[i] * base + (rnk[i + k] + 1 if i + k < n else 0) for i in range(n)]
        sa.sort(key=key.__getitem__)
        tmp = [0] * n
        for idx in range(1, n):
            tmp[sa[idx]] = tmp[sa[idx - 1]] + (key[sa[idx]] != key[sa[idx - 1]])
        rnk = tmp
        if rnk[sa[-1]] == n - 1:
            break
        k <<= 1
    return sa


# lcp[i] = prefijo común entre sa[i] y sa[i + 1] (Kasai)
def kasai(s, sa):
    n = len(s)
    rnk = [0] * n
    for i, p in enumerate(sa):
        rnk[p] = i
    lcp = [0] * max(0, n - 1)
    h = 0
    for i in range(n):
        if rnk[i] + 1 < n:
            j = sa[rnk[i] + 1]
            while i + h < n and j + h < n and s[i + h] == s[j + h]:
                h += 1
            lcp[rnk[i]] = h
            if h > 0:
                h -= 1
        else:
            h = 0
    return lcp


def main():
    s = input().strip()
    n = len(s)
    sa = suffix_array(s)
    # cada sufijo aporta (largo) subcadenas; se restan las que ya aparecieron (lcp)
    print(n * (n + 1) // 2 - sum(kasai(s, sa)))


main()
