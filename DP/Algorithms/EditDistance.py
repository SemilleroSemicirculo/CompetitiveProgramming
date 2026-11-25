import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Distancia de edición (Levenshtein)
 * Problema  : CSES 1639 - Edit Distance (https://cses.fi/problemset/task/1639)
 * Entrada   : dos cadenas a y b
 * Salida    : mínimo de operaciones (insertar, borrar, reemplazar) para convertir a en b
 * Complejidad: tiempo O(n·m), memoria O(n·m)
"""
def main():
    a = input().strip()
    b = input().strip()
    n, m = len(a), len(b)

    # dp[i][j] = distancia entre a[0..i) y b[0..j); se guardan solo dos filas
    # convertir un prefijo en vacío cuesta borrar todo (y al revés insertar)
    prev = list(range(m + 1))
    for i in range(1, n + 1):
        cur = [i] + [0] * m
        ai = a[i - 1]
        for j in range(1, m + 1):
            # borrar, insertar o reemplazar (cuesta 0 si los caracteres coinciden)
            cur[j] = min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (ai != b[j - 1]))
        prev = cur
    print(prev[m])


main()
