import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Eertree (árbol de palíndromos: un nodo por cada palíndromo distinto)
 * Problema  : APIO 2014 - Palindromes (https://oj.uz/problem/view/APIO14_palindrome)
 * Entrada   : una cadena s de minúsculas (|s| ≤ 3·10^5)
 * Salida    : el máximo, entre los palíndromos de s, de (longitud × cantidad de apariciones)
 * Complejidad: tiempo O(|s|) amortizado (transiciones en diccionarios), memoria O(|s|)
"""


def main():
    s = sys.stdin.readline().strip()
    nxt = [{}, {}]
    ln = [-1, 0]
    link = [0, 0]
    cnt = [0, 0]
    last = 1
    for i, ch in enumerate(s):
        v = last
        while i - 1 - ln[v] < 0 or s[i - 1 - ln[v]] != ch:
            v = link[v]
        if ch not in nxt[v]:
            if v == 0:
                lk = 1
            else:
                w = link[v]
                while i - 1 - ln[w] < 0 or s[i - 1 - ln[w]] != ch:
                    w = link[w]
                lk = nxt[w][ch]
            nxt.append({})
            ln.append(ln[v] + 2)
            link.append(lk)
            cnt.append(0)
            nxt[v][ch] = len(ln) - 1
        last = nxt[v][ch]
        cnt[last] += 1
    best = 0
    for v in range(len(ln) - 1, 1, -1):
        best = max(best, cnt[v] * ln[v])
        cnt[link[v]] += cnt[v]
    print(best)


main()
