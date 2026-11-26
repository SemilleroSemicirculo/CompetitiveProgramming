import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Función φ de Euler para todos los números hasta N (criba)
 * Problema  : SPOJ ETF - Euler Totient Function (https://www.spoj.com/problems/ETF/)
 * Entrada   : T, luego T números n (1 ≤ n ≤ 10^6)
 * Salida    : φ(n) para cada uno: cuántos k en [1, n] cumplen gcd(k, n) = 1
 * Complejidad: tiempo O(N log log N + T), memoria O(N)
"""


def main():
    data = sys.stdin.buffer.read().split()
    T = int(data[0])
    qs = list(map(int, data[1:1 + T]))
    N = max(qs) if qs else 1
    # φ(n) = n · Π (1 − 1/p) sobre los primos p que dividen a n
    phi = list(range(N + 1))
    for p in range(2, N + 1):
        if phi[p] == p:                   # p es primo
            for j in range(p, N + 1, p):
                phi[j] -= phi[j] // p
    sys.stdout.write("\n".join(str(phi[n]) for n in qs) + "\n")


main()
