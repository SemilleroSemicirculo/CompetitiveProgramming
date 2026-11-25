import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Exponenciación binaria (rápida) modular
 * Problema  : CSES 1095 - Exponentiation (https://cses.fi/problemset/task/1095)
 * Entrada   : n, luego n pares "a b"
 * Salida    : a^b módulo 10^9+7 para cada par (con 0^0 = 1)
 * Complejidad: tiempo O(log b) por par, memoria O(1)
"""

M = 10**9 + 7


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    v = list(map(int, data[1:1 + 2 * n]))
    # pow(a, b, M) de Python ya hace exponenciación binaria (y da 1 para 0^0)
    print('\n'.join(str(pow(v[k], v[k + 1], M)) for k in range(0, 2 * n, 2)))


main()
