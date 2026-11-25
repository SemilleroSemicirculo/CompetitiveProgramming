import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Distribución binomial (n ensayos de Bernoulli independientes con probabilidad p)
 * Problema  : Sin problema equivalente en CSES; formato propio
 * Entrada   : n k p (n ≤ 1000, 0 ≤ k ≤ n, 0 ≤ p ≤ 1)
 * Salida    : P(X = k), P(X ≥ k), E[X] = np y Var(X) = np(1 − p), uno por línea con nueve decimales
 * Complejidad: tiempo O(n^2), memoria O(n)
"""


def main():
    parts = input().split()
    n, k, p = int(parts[0]), int(parts[1]), float(parts[2])
    q = 1 - p
    # d[i] = P(i éxitos en los ensayos hechos hasta ahora); cada ensayo es éxito con p
    d = [1.0]
    for _ in range(n):
        d = [a * q + b * p for a, b in zip(d + [0.0], [0.0] + d)]
    # forma cerrada equivalente: P(X = k) = C(n, k) · p^k · (1 − p)^(n − k)
    print(f"{d[k]:.9f}")
    print(f"{sum(d[k:]):.9f}")
    print(f"{n * p:.9f}")
    print(f"{n * p * q:.9f}")


main()
