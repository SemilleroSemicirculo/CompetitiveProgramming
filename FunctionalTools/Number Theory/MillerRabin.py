import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Test de primalidad de Miller-Rabin determinista para n < 2^64 (basado en KACTL, CC0)
 * Problema  : Library Checker - Primality Test (https://judge.yosupo.jp/problem/primality_test)
 * Entrada   : Q, luego Q números N (1 ≤ N ≤ 10^18)
 * Salida    : "Yes" si N es primo y "No" si no, uno por línea
 * Complejidad: tiempo O(7 · log N) multiplicaciones por consulta, memoria O(1)
"""

PEQ = (2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37)
BASES = (2, 325, 9375, 28178, 450775, 9780504, 1795265022)


def is_prime(n):
    if n < 2:
        return False
    for p in PEQ:
        if n % p == 0:
            return n == p
    d, s = n - 1, 0
    while d % 2 == 0:
        d //= 2
        s += 1
    for a in BASES:
        x = pow(a, d, n)          # pow de Python hace la exponenciación modular rápido
        if x in (0, 1, n - 1):
            continue
        for _ in range(s - 1):
            x = x * x % n
            if x == n - 1:
                break
        else:
            return False          # a es testigo: n es compuesto
    return True


def main():
    data = sys.stdin.buffer.read().split()
    q = int(data[0])
    sys.stdout.write("\n".join("Yes" if is_prime(int(x)) else "No" for x in data[1:1 + q]) + "\n")


main()
