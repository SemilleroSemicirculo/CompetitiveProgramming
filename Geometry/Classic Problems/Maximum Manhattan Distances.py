import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Rotación de 45° (|dx| + |dy| = max(|du|, |dv|) con u = x + y, v = x - y)
 * Problema  : CSES 3410 - Maximum Manhattan Distances (https://cses.fi/problemset/task/3410)
 * Entrada   : n, luego n puntos "x y" que se agregan uno por uno
 * Salida    : después de cada punto, la mayor distancia Manhattan entre dos puntos del conjunto
 * Complejidad: tiempo O(n), memoria O(1)
"""


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    v = list(map(int, data[1:1 + 2 * n]))
    # basta conocer el mínimo y el máximo de u = x + y y de w = x - y
    lo_u = lo_w = INF
    hi_u = hi_w = -INF
    out = []
    for k in range(0, 2 * n, 2):
        x, y = v[k], v[k + 1]
        u, w = x + y, x - y
        if u < lo_u: lo_u = u
        if u > hi_u: hi_u = u
        if w < lo_w: lo_w = w
        if w > hi_w: hi_w = w
        out.append(max(hi_u - lo_u, hi_w - lo_w))
    print('\n'.join(map(str, out)))


main()
