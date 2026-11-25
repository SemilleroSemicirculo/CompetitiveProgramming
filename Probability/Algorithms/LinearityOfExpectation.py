import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Linealidad de la esperanza (sumar la probabilidad de cada par)
 * Problema  : CSES 1728 - Inversion Probability (https://cses.fi/problemset/task/1728)
 * Entrada   : n, luego r_1 … r_n (x_i es uniforme en [1, r_i])
 * Salida    : número esperado de inversiones, con seis decimales
 * Complejidad: tiempo O(n^2 · R), memoria O(n)
"""


def main():
    n = int(input())
    r = list(map(int, input().split()))
    # E[inversiones] = Σ_{i<j} P(x_i > x_j), aunque los pares no sean independientes
    res = 0.0
    for i in range(n):
        for j in range(i + 1, n):
            # casos favorables: x_i = v y x_j < v → min(v − 1, r_j) opciones
            fav = sum(min(v - 1, r[j]) for v in range(1, r[i] + 1))
            res += fav / (r[i] * r[j])
    print(f"{res:.6f}")


main()
