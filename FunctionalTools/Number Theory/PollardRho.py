import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Factorización con Pollard rho (variante de Brent) + Miller-Rabin (basado en KACTL, CC0)
 * Problema  : Library Checker - Factorize (https://judge.yosupo.jp/problem/factorize)
 * Entrada   : Q, luego Q números a (1 ≤ a ≤ 10^18)
 * Salida    : por cada a, la cantidad de factores primos (con repetición) y los factores en orden
 * Complejidad: tiempo esperado O(n^(1/4)) por factor encontrado, memoria O(log n)
"""
import random
from math import gcd

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
        x = pow(a, d, n)
        if x in (0, 1, n - 1):
            continue
        for _ in range(s - 1):
            x = x * x % n
            if x == n - 1:
                break
        else:
            return False
    return True


def rho(n):
    """Un divisor propio de n (compuesto e impar), con el ciclo de Brent."""
    while True:
        c = random.randrange(1, n)
        y = random.randrange(n)
        g = q = r = 1
        while g == 1:
            x = y
            for _ in range(r):
                y = (y * y + c) % n
            k = 0
            while k < r and g == 1:
                ys = y
                for _ in range(min(128, r - k)):   # un gcd por bloque de 128 pasos
                    y = (y * y + c) % n
                    q = q * abs(x - y) % n
                g = gcd(q, n)
                k += 128
            r *= 2
        if g == n:                                # el bloque se pasó: paso a paso
            while True:
                ys = (ys * ys + c) % n
                g = gcd(abs(x - ys), n)
                if g > 1:
                    break
        if g != n:
            return g


def factor(n, out):
    if n == 1:
        return
    while n % 2 == 0:
        out.append(2)
        n //= 2
    if n == 1:
        return
    if is_prime(n):
        out.append(n)
        return
    d = rho(n)
    factor(d, out)
    factor(n // d, out)


def main():
    q = int(input())
    res = []
    for _ in range(q):
        f = []
        factor(int(input()), f)
        f.sort()
        res.append(" ".join(map(str, [len(f)] + f)))
    print("\n".join(res))


main()
