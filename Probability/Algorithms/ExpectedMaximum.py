import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Esperanza del máximo con P(máx ≤ m) = (m/k)^n
 * Problema  : CSES 1727 - Candy Lottery (https://cses.fi/problemset/task/1727)
 * Entrada   : n k
 * Salida    : valor esperado del máximo de n enteros al azar en [1, k], con seis decimales
 * Complejidad: tiempo O(k log n), memoria O(1)
"""


def main():
    n, k = map(int, input().split())
    # P(máx ≤ m) = (m/k)^n porque todos deben ser ≤ m; P(máx = m) = (m/k)^n − ((m−1)/k)^n
    res = sum(m * ((m / k) ** n - ((m - 1) / k) ** n) for m in range(1, k + 1))
    print(f"{res:.6f}")


main()
