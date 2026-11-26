import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Orden angular exacto (por semiplano y luego producto cruz, sin atan2)
 * Problema  : Library Checker - Sort Points by Argument (https://judge.yosupo.jp/problem/sort_points_by_argument)
 * Entrada   : N; N puntos "x y" enteros
 * Salida    : los puntos ordenados por argumento en (−π, π]; (0, 0) cuenta como argumento 0; empates en cualquier orden
 * Complejidad: tiempo O(N log N), memoria O(N)
"""
from functools import cmp_to_key


def clave(p):                             # 0: abajo; 1: origen y eje x positivo; 2: arriba (incluye ángulo π)
    x, y = p
    if y < 0:
        return 0
    if y == 0 and x >= 0:
        return 1
    return 2


def cmp(a, b):
    ka, kb = clave(a), clave(b)
    if ka != kb:
        return -1 if ka < kb else 1
    if ka == 1:
        return 0
    c = a[0] * b[1] - a[1] * b[0]
    return -1 if c > 0 else (1 if c < 0 else 0)


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    p = [(int(data[1 + 2 * i]), int(data[2 + 2 * i])) for i in range(n)]
    p.sort(key=cmp_to_key(cmp))
    sys.stdout.write("".join(f"{x} {y}\n" for x, y in p))


main()
