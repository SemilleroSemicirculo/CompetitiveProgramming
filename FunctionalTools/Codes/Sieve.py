import sys
import math

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Criba de Eratóstenes y criba segmentada
 * Problema  : Sin problema equivalente en CSES; formato propio
 * Entrada   : N, luego L R
 * Salida    : primos ≤ N y luego los primos en [L, R]
 * Complejidad: tiempo O(N log log N) y O((R-L) log log R), memoria O(N + R - L)
"""


# is_prime[x] queda en True si x es primo
def sieve(N):
    is_prime = [True] * (N + 1)
    is_prime[0] = False
    if N >= 1:
        is_prime[1] = False
    # solo hace falta tachar múltiplos de primos hasta sqrt(N)
    p = 2
    while p * p <= N:
        if is_prime[p]:
            for x in range(p * p, N + 1, p):
                is_prime[x] = False
        p += 1
    return is_prime


# criba por segmentos: se tachan los múltiplos de los primos pequeños dentro de [L, R]
def segmented_sieve(L, R):
    lim = math.isqrt(R)
    base = sieve(lim)
    primes = [i for i in range(2, lim + 1) if base[i]]
    is_prime = [True] * (R - L + 1)
    for x in range(L, min(R, 1) + 1):
        is_prime[x - L] = False
    for p in primes:
        # primer múltiplo de p dentro del rango (sin tachar a p mismo)
        start = max(p * p, (L + p - 1) // p * p)
        for x in range(start, R + 1, p):
            is_prime[x - L] = False
    return [L + i for i in range(R - L + 1) if is_prime[i]]


def main():
    data = sys.stdin.read().split()
    N, L, R = int(data[0]), int(data[1]), int(data[2])
    small = sieve(N)
    print(" ".join(str(i) for i in range(2, N + 1) if small[i]) + " ")
    print(" ".join(map(str, segmented_sieve(L, R))) + " ")


main()
