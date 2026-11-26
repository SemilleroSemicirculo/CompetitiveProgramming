import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Logaritmo discreto con baby-step giant-step (también con módulo no primo)
 * Problema  : Library Checker - Discrete Logarithm (https://judge.yosupo.jp/problem/discrete_logarithm_mod)
 * Entrada   : T; luego T líneas "X Y M" (0 ≤ X, Y < M ≤ 10^9)
 * Salida    : el menor K ≥ 0 con X^K ≡ Y (mód M), o -1 si no existe
 * Complejidad: tiempo O(√M) por consulta, memoria O(√M)
"""
from math import gcd, isqrt


def dlog(a, b, m):
    if m == 1:
        return 0
    a %= m
    b %= m
    if b == 1:
        return 0
    k, add = 0, 1
    g = gcd(a, m)
    while g > 1:                          # quitar los factores comunes de a y m
        if b == add:
            return k
        if b % g:
            return -1
        b //= g
        m //= g
        k += 1
        add = add * (a // g) % m
        g = gcd(a, m)
    if add == b % m:
        return k
    n = isqrt(m) + 1
    baby = {}
    cur = b % m
    for j in range(n):
        baby[cur] = j
        cur = cur * a % m
    an = pow(a, n, m)
    cur = add
    for i in range(1, n + 1):
        cur = cur * an % m
        if cur in baby:
            return k + i * n - baby[cur]
    return -1


def main():
    out = []
    for _ in range(int(input())):
        x, y, m = map(int, input().split())
        out.append(dlog(x, y, m))
    print("\n".join(map(str, out)))


main()
