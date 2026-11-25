import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : DP de probabilidades (distribución de la suma de varios dados)
 * Problema  : CSES 1725 - Dice Probability (https://cses.fi/problemset/task/1725)
 * Entrada   : n a b
 * Salida    : probabilidad de que la suma de n dados esté en [a, b], con seis decimales
 * Complejidad: tiempo O(n · 6n · 6), memoria O(6n)
"""


def main():
    n, a, b = map(int, input().split())
    # p[s] = probabilidad de que la suma de los dados lanzados hasta ahora sea s
    p = [1.0]
    for _ in range(n):
        q = [0.0] * (len(p) + 6)
        # cada cara 1..6 sale con probabilidad 1/6 y suma su valor
        for s, ps in enumerate(p):
            if ps:
                ps /= 6
                for c in range(1, 7):
                    q[s + c] += ps
        p = q
    print(f"{sum(p[a:b + 1]):.6f}")


main()
