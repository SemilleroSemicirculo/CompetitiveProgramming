import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Rabin-Karp con doble hash polinomial
 * Problema  : CSES 1753 - String Matching (https://cses.fi/problemset/task/1753)
 * Entrada   : texto s y luego patrón t (letras minúsculas)
 * Salida    : cantidad de apariciones de t en s
 * Complejidad: tiempo O(|s| + |t|) esperado, memoria O(|s|)
"""


# dos módulos y una base para reducir colisiones
P1, P2, BASE = 1000000007, 998244353, 60


def main():
    s1 = input().strip()
    s2 = input().strip()
    n, m = len(s1), len(s2)
    if m > n:
        print(0)
        return
    code = lambda c: ord(c) - ord('a') + 1

    # h[i] = hash del prefijo s1[0..i) y pw[i] = BASE^i, para los dos módulos
    h1, h2 = [0] * (n + 1), [0] * (n + 1)
    pw1, pw2 = [1] * (n + 1), [1] * (n + 1)
    for i, c in enumerate(s1):
        h1[i + 1] = (h1[i] * BASE + code(c)) % P1
        h2[i + 1] = (h2[i] * BASE + code(c)) % P2
        pw1[i + 1] = pw1[i] * BASE % P1
        pw2[i + 1] = pw2[i] * BASE % P2

    # hash del patrón
    t1 = t2 = 0
    for c in s2:
        t1 = (t1 * BASE + code(c)) % P1
        t2 = (t2 * BASE + code(c)) % P2

    # se compara el hash de cada ventana con el del patrón (quitar un prefijo = restar su hash)
    count = 0
    for i in range(n - m + 1):
        if (h1[i + m] - h1[i] * pw1[m]) % P1 == t1 and (h2[i + m] - h2[i] * pw2[m]) % P2 == t2:
            count += 1
    print(count)


main()
