import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Combinatoria (estrellas y barras) con factoriales e inversos modulares
 * Problema  : CSES 1716 - Distributing Apples (https://cses.fi/problemset/task/1716)
 * Entrada   : n m (niños y manzanas)
 * Salida    : formas de repartir m manzanas entre n niños, módulo 10^9+7
 * Complejidad: tiempo O(n + m), memoria O(1)
"""

M = 10**9 + 7


def main():
    n, m = map(int, input().split())
    # m manzanas (estrellas) y n-1 separadores (barras): C(m + n - 1, n - 1)
    k = n - 1
    num = den = 1
    for i in range(1, k + 1):
        num = num * (m + i) % M   # (m+1)(m+2)...(m+k)
        den = den * i % M         # k!
    # inverso con el pequeño teorema de Fermat
    print(num * pow(den, M - 2, M) % M)


main()
