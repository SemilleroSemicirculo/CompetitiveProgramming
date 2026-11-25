import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Probabilidad continua: reducir a órdenes relativos de puntos uniformes + DP modular
 * Problema  : Codeforces 1153F - Serval and Bonus Problem (https://codeforces.com/problemset/problem/1153/F)
 * Entrada   : n k l
 * Salida    : longitud esperada cubierta por al menos k de n segmentos al azar en [0, l], mód 998244353
 * Complejidad: tiempo O(n^2), memoria O(n)
"""


def main():
    n, k, l = map(int, input().split())
    # E[longitud] = l · P(un punto x uniforme quede cubierto por ≥ k segmentos).
    # Todos los órdenes de los 2n + 1 puntos (extremos y x) son igual de probables: se cuentan órdenes.
    # f0[j] / f1[j] = formas con j segmentos abiertos, sin / con x ya colocado
    f0 = [1] + [0] * n
    f1 = [0] * (n + 1)
    mult = list(range(n + 1))
    for _ in range(2 * n + 1):
        # abrir: j -> j + 1; cerrar uno de los j abiertos: j -> j − 1 (j formas)
        g0 = [((f0[j - 1] if j else 0) + (f0[j + 1] * mult[j + 1] if j < n else 0)) % MOD for j in range(n + 1)]
        g1 = [((f1[j - 1] if j else 0) + (f1[j + 1] * mult[j + 1] if j < n else 0) + (f0[j] if j >= k else 0)) % MOD for j in range(n + 1)]
        f0, f1 = g0, g1
    # cada orden contado corresponde a n! · 2^n órdenes de puntos etiquetados, de (2n + 1)! posibles
    num = f1[0]
    for i in range(1, n + 1):
        num = num * i * 2 % MOD
    den = 1
    for i in range(1, 2 * n + 2):
        den = den * i % MOD
    print(num * pow(den, MOD - 2, MOD) % MOD * (l % MOD) % MOD)


main()
