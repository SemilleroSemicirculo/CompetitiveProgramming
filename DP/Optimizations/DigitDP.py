import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : DP de dígitos genérica (posición, estado, ¿sigo pegado al límite?)
 * Problema  : Codeforces 1036C - Classy Numbers (https://codeforces.com/problemset/problem/1036/C)
 * Entrada   : T; luego T consultas L R (1 ≤ L ≤ R ≤ 10^18)
 * Salida    : cuántos números de [L, R] tienen a lo sumo 3 dígitos distintos de cero
 * Complejidad: tiempo O(T · D · K · 10) con D = 19 dígitos y K = 4 estados, memoria O(D · K)
"""
from functools import lru_cache


@lru_cache(maxsize=None)
def libre(restantes, nz):
    """Formas de poner `restantes` dígitos sin límite, con nz no nulos ya usados."""
    if nz > 3:
        return 0
    if restantes == 0:
        return 1
    return libre(restantes - 1, nz) + 9 * libre(restantes - 1, nz + 1)


def f(x):
    """Cuántos números de [0, x] tienen a lo sumo 3 dígitos no nulos."""
    if x < 0:
        return 0
    dig = str(x)
    total, nz = 0, 0
    for pos, ch in enumerate(dig):            # se recorre el camino "pegado al límite"
        lim = int(ch)
        resto = len(dig) - pos - 1
        for d in range(lim):                  # poner d < lim libera el resto
            total += libre(resto, nz + (d != 0))
        nz += lim != 0
        if nz > 3:
            return total
    return total + 1                          # el propio x


def main():
    out = []
    for _ in range(int(input())):
        L, R = map(int, input().split())
        out.append(f(R) - f(L - 1))
    print("\n".join(map(str, out)))


main()
