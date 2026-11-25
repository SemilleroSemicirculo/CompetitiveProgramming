import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : KMP con prefix-function solo del patrón
 * Problema  : CSES 1753 - String Matching (https://cses.fi/problemset/task/1753)
 * Entrada   : texto s y luego patrón t
 * Salida    : cantidad de apariciones de t en s
 * Complejidad: tiempo O(|s| + |t|), memoria O(|t|)
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


# recorre el texto reutilizando LP del patrón para no retroceder
def pattern_search(text, pattern):
    lp = KMP(pattern)
    res = []
    j = 0
    for i, c in enumerate(text):
        while j > 0 and c != pattern[j]:
            j = lp[j - 1]
        if c == pattern[j]:
            j += 1
        # coincidencia completa; se sigue con el borde más largo
        if j == len(pattern):
            res.append(i - len(pattern) + 1)
            j = lp[j - 1]
    return res


def main():
    s = input().strip()
    t = input().strip()
    print(len(pattern_search(s, t)))


main()
