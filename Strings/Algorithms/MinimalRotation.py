import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Rotación lexicográficamente mínima (método de los dos índices)
 * Problema  : CSES 1110 - Minimal Rotation (https://cses.fi/problemset/task/1110)
 * Entrada   : una cadena s
 * Salida    : la rotación lexicográficamente mínima de s
 * Complejidad: tiempo O(n), memoria O(n)
"""


# índice de inicio de la rotación mínima
def minimal_rotation(s):
    # la rotación mínima es una subcadena de s + s
    t = s + s
    n = len(s)
    i, j, k = 0, 1, 0
    # se comparan dos candidatos i y j; el peor se descarta saltando k + 1 posiciones
    while i < n and j < n and k < n:
        a, b = t[i + k], t[j + k]
        if a == b:
            k += 1
            continue
        if a > b:
            i += k + 1
        else:
            j += k + 1
        if i == j:
            j += 1
        k = 0
    # el candidato que sobrevive
    return min(i, j)


def main():
    s = input().strip()
    p = minimal_rotation(s)
    print(s[p:] + s[:p])


main()
