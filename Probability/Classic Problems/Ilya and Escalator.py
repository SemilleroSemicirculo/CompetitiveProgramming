import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : DP sobre la distribución en el tiempo (proceso que avanza con probabilidad p)
 * Problema  : Codeforces 518D - Ilya and Escalator (https://codeforces.com/problemset/problem/518/D)
 * Entrada   : n p t
 * Salida    : número esperado de personas en la escalera tras t segundos (error ≤ 10^-6)
 * Complejidad: tiempo O(n · t), memoria O(n)
"""


def main():
    parts = input().split()
    n, p, t = int(parts[0]), float(parts[1]), int(parts[2])
    q = 1 - p
    # d[i] = probabilidad de que haya i personas en la escalera
    d = [1.0] + [0.0] * n
    for _ in range(t):
        # i personas: o ya había i y nadie entró, o había i−1 y entró uno; con n ya no cambia
        e = [d[0] * q] + [a * q + b * p for a, b in zip(d[1:n], d[:n - 1])] + [d[n] + d[n - 1] * p] if n > 1 else [d[0] * q, d[1] + d[0] * p]
        d = e
    print(f"{sum(i * x for i, x in enumerate(d)):.9f}")


main()
