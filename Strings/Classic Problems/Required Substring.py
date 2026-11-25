import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : DP sobre el autómata de KMP (contar cadenas que contienen un patrón)
 * Problema  : CSES 1112 - Required Substring (https://cses.fi/problemset/task/1112)
 * Entrada   : n, luego un patrón de largo m (letras A–Z)
 * Salida    : cantidad de cadenas de largo n que contienen el patrón, módulo 10^9+7
 * Complejidad: tiempo O(n · m · d) con d = destinos distintos por estado (pocos), memoria O(m · 26)
"""

M = 10**9 + 7


def main():
    n = int(input())
    p = input().strip()
    m = len(p)
    # función de prefijos del patrón
    pi = [0] * m
    for i in range(1, m):
        j = pi[i - 1]
        while j and p[i] != p[j]:
            j = pi[j - 1]
        if p[i] == p[j]:
            j += 1
        pi[i] = j
    # go[k][c] = caracteres emparejados si tenía k y leo c
    go = [[0] * 26 for _ in range(m)]
    for k in range(m):
        for c in range(26):
            if ord(p[k]) - 65 == c:
                go[k][c] = k + 1
            else:
                go[k][c] = go[pi[k - 1]][c] if k else 0
    # se agrupan las 26 letras por destino: trans[k] = [(destino, cuántas letras llevan ahí)]
    trans = []
    for k in range(m):
        cnt = {}
        for t in go[k]:
            if t < m:  # si t == m el patrón ya apareció: no se cuenta como "mala"
                cnt[t] = cnt.get(t, 0) + 1
        trans.append(list(cnt.items()))
    # dp[k] = cadenas que todavía NO contienen el patrón y tienen k emparejados
    dp = [0] * m
    dp[0] = 1
    for _ in range(n):
        nd = [0] * m
        for k in range(m):
            v = dp[k]
            if v:
                for t, c in trans[k]:
                    nd[t] += v * c
        dp = [x % M for x in nd]
    print((pow(26, n, M) - sum(dp)) % M)


main()
