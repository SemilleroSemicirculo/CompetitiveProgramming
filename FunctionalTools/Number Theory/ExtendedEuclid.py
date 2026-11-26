import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Euclides extendido (ecuación diofántica lineal a·x + b·y = c)
 * Problema  : Codeforces 7C - Line (https://codeforces.com/problemset/problem/7/C)
 * Entrada   : A, B, C de la recta A·x + B·y + C = 0 (A² + B² > 0)
 * Salida    : un punto (x, y) con coordenadas enteras sobre la recta, o -1 si no existe
 * Complejidad: tiempo O(log min(|A|, |B|)), memoria O(1)
"""


def ext_gcd(a, b):
    """Devuelve (g, x, y) con a·x + b·y = g = gcd(a, b). Versión iterativa."""
    x0, y0, x1, y1 = 1, 0, 0, 1
    while b:
        q = a // b
        a, b = b, a - q * b
        x0, x1 = x1, x0 - q * x1   # se mantiene a = x0·a_ini + y0·b_ini
        y0, y1 = y1, y0 - q * y1
    return a, x0, y0


def main():
    A, B, C = map(int, input().split())
    g, x, y = ext_gcd(abs(A), abs(B))
    if C % g:
        print(-1)
        return
    if A < 0:
        x = -x
    if B < 0:
        y = -y
    k = -C // g
    print(x * k, y * k)


main()
