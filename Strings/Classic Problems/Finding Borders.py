import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Función de prefijos (KMP) y cadena de bordes
 * Problema  : CSES 1732 - Finding Borders (https://cses.fi/problemset/task/1732)
 * Entrada   : una cadena de largo n
 * Salida    : todos los largos de bordes (prefijo que también es sufijo, sin ser toda la cadena) en orden creciente
 * Complejidad: tiempo O(n), memoria O(n)
"""


def main():
    s = sys.stdin.buffer.readline().strip()
    n = len(s)
    # pi[i] = largo del mayor borde de s[0..i]
    pi = [0] * n
    j = 0
    for i in range(1, n):
        c = s[i]
        while j and c != s[j]:
            j = pi[j - 1]
        if c == s[j]:
            j += 1
        pi[i] = j
    # los bordes de s: el mayor (pi[n-1]), el mayor borde de ese borde, y así sucesivamente
    res = []
    b = pi[n - 1]
    while b:
        res.append(b)
        b = pi[b - 1]
    print(*reversed(res))


main()
