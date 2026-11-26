import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Teorema chino del resto general (módulos no necesariamente coprimos)
 * Problema  : Kattis - generalchineseremainder (https://open.kattis.com/problems/generalchineseremainder)
 * Entrada   : T casos; cada uno "a n b m" con 0 ≤ a < n, 0 ≤ b < m, n, m ≤ 10^9
 * Salida    : "x K" con K = mcm(n, m) y 0 ≤ x < K tal que x ≡ a (mód n) y x ≡ b (mód m), o "no solution"
 * Complejidad: tiempo O(log) por caso, memoria O(1)
"""


def ext_gcd(a, b):
    x0, y0, x1, y1 = 1, 0, 0, 1
    while b:
        q = a // b
        a, b = b, a - q * b
        x0, x1 = x1, x0 - q * x1
        y0, y1 = y1, y0 - q * y1
    return a, x0, y0


def crt(a, n, b, m):
    """Combina x ≡ a (mód n) y x ≡ b (mód m). Devuelve (x, mcm) o None."""
    g, p, _ = ext_gcd(n, m)          # n·p + m·q = g
    if (b - a) % g:
        return None
    l = n // g * m
    t = (b - a) // g * p % (m // g)  # n·t ≡ b − a (mód m)
    return (a + n * t) % l, l


def main():
    out = []
    for _ in range(int(input())):
        a, n, b, m = map(int, input().split())
        r = crt(a, n, b, m)
        out.append("no solution" if r is None else f"{r[0]} {r[1]}")
    print("\n".join(out))


main()
