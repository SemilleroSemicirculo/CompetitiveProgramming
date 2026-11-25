import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : DP para contar subsecuencias distintas
 * Problema  : CSES 1149 - Distinct Subsequences (https://cses.fi/problemset/task/1149)
 * Entrada   : una cadena de largo n
 * Salida    : cantidad de subsecuencias distintas no vacías, módulo 10^9+7
 * Complejidad: tiempo O(n), memoria O(1)
"""

M = 10**9 + 7


def main():
    s = sys.stdin.buffer.readline().strip()
    # total = subsecuencias distintas (incluida la vacía) del prefijo leído
    # last[c] = valor de total justo antes de la última vez que apareció c
    total = 1
    last = [0] * 256
    for c in s:
        # se duplica el total, pero las que ya terminaban en c se habrían contado dos veces
        nuevo = (2 * total - last[c]) % M
        last[c] = total
        total = nuevo
    print((total - 1) % M)  # se quita la subsecuencia vacía


main()
