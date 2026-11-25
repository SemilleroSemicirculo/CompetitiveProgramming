import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Criba del menor factor primo + fórmula de cantidad de divisores
 * Problema  : CSES 1713 - Counting Divisors (https://cses.fi/problemset/task/1713)
 * Entrada   : n, luego n enteros x (x ≤ 10^6)
 * Salida    : la cantidad de divisores de cada x
 * Complejidad: tiempo O(X log log X + n log x), memoria O(X)
"""

X = 10**6


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    # spf[v] = menor factor primo de v. Se recorren los primos de mayor a menor hasta 1000:
    # cada asignación por rebanadas pisa a las de primos mayores, así queda el menor.
    spf = list(range(X + 1))
    small = [p for p in range(2, 1001) if all(p % q for q in range(2, int(p**0.5) + 1))]
    for p in reversed(small):
        spf[p * p::p] = [p] * len(range(p * p, X + 1, p))
    out = []
    for x in map(int, data[1:1 + n]):
        # si x = p1^e1 · p2^e2 · ..., tiene (e1 + 1)(e2 + 1)... divisores
        res = 1
        while x > 1:
            p = spf[x]
            e = 1
            x //= p
            while x % p == 0:
                x //= p
                e += 1
            res *= e + 1
        out.append(res)
    print('\n'.join(map(str, out)))


main()
