import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Subsecuencia común más larga (LCS) con reconstrucción
 * Problema  : CSES 3403 - Longest Common Subsequence (https://cses.fi/problemset/task/3403)
 * Entrada   : n m, luego los n enteros de a y los m enteros de b
 * Salida    : longitud de la LCS y una LCS
 * Complejidad: tiempo O(n·m), memoria O(n·m)
"""
def main():
    n, m = map(int, input().split())
    a = list(map(int, input().split()))
    b = list(map(int, input().split()))

    # LCS[i][j] = longitud de la LCS de a[0..i) y b[0..j)
    LCS = [[0] * (m + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        prev, cur, ai = LCS[i - 1], LCS[i], a[i - 1]
        for j in range(1, m + 1):
            # si los últimos coinciden se extiende la LCS; si no, se descarta uno de los dos
            if ai == b[j - 1]:
                cur[j] = prev[j - 1] + 1
            else:
                cur[j] = prev[j] if prev[j] >= cur[j - 1] else cur[j - 1]

    # se camina desde (n, m) hacia atrás para recuperar una LCS
    res = []
    i, j = n, m
    while i > 0 and j > 0:
        if a[i - 1] == b[j - 1]:
            res.append(a[i - 1])
            i -= 1
            j -= 1
        elif LCS[i - 1][j] >= LCS[i][j - 1]:
            i -= 1
        else:
            j -= 1
    # se construyó al revés
    res.reverse()

    print(LCS[n][m])
    print(*res)


main()
