import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : KMP con prefix-function sobre patrón + '#' + texto
 * Problema  : CSES 1753 - String Matching (https://cses.fi/problemset/task/1753)
 * Entrada   : texto s y luego patrón t
 * Salida    : cantidad de apariciones de t en s
 * Complejidad: tiempo O(|s| + |t|), memoria O(|s| + |t|)
"""


# LP[i] = longitud del mayor prefijo que también es sufijo de s[0..i]
def KMP(s):
    LP = [0] * len(s)
    for i in range(1, len(s)):
        j = LP[i - 1]
        while j > 0 and s[i] != s[j]:
            j = LP[j - 1]
        if s[i] == s[j]:
            j += 1
        LP[i] = j
    return LP


# se concatena t + "#" + s: un valor |t| en LP marca una aparición
def pattern_search(s, t):
    lps = KMP(t + '#' + s)
    m = len(t)
    return [i - 2 * m for i in range(m + 1, len(lps)) if lps[i] == m]


def main():
    s = input().strip()
    t = input().strip()
    print(len(pattern_search(s, t)))


main()
