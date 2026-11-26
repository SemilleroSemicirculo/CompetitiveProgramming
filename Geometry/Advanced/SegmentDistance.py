import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Distancia punto-segmento y distancia entre dos segmentos
 * Problema  : Kattis - Segment Distance (https://open.kattis.com/problems/segmentdistance)
 * Entrada   : n casos; cada uno x1 y1 x2 y2 x3 y3 x4 y4 (segmentos P1P2 y P3P4, |coord| ≤ 10^4)
 * Salida    : la distancia mínima entre los dos segmentos, con 2 decimales
 * Complejidad: tiempo O(1) por caso, memoria O(1)
"""
from math import hypot, sqrt


def cross(ax, ay, bx, by):
    return ax * by - ay * bx


def orient(a, b, c):
    v = cross(b[0] - a[0], b[1] - a[1], c[0] - a[0], c[1] - a[1])
    return (v > 0) - (v < 0)


def en_caja(a, b, c):
    return min(a[0], b[0]) <= c[0] <= max(a[0], b[0]) and min(a[1], b[1]) <= c[1] <= max(a[1], b[1])


def se_cortan(a, b, c, d):
    o1, o2, o3, o4 = orient(a, b, c), orient(a, b, d), orient(c, d, a), orient(c, d, b)
    if o1 * o2 < 0 and o3 * o4 < 0:
        return True
    return ((o1 == 0 and en_caja(a, b, c)) or (o2 == 0 and en_caja(a, b, d)) or
            (o3 == 0 and en_caja(c, d, a)) or (o4 == 0 and en_caja(c, d, b)))


def dist_ps(p, a, b):
    abx, aby = b[0] - a[0], b[1] - a[1]
    apx, apy = p[0] - a[0], p[1] - a[1]
    L = abx * abx + aby * aby
    if L == 0:
        return hypot(apx, apy)
    t = apx * abx + apy * aby
    if t <= 0:
        return hypot(apx, apy)
    if t >= L:
        return hypot(p[0] - b[0], p[1] - b[1])
    return abs(cross(abx, aby, apx, apy)) / sqrt(L)


def main():
    out = []
    for _ in range(int(input())):
        v = list(map(int, input().split()))
        a, b, c, d = (v[0], v[1]), (v[2], v[3]), (v[4], v[5]), (v[6], v[7])
        r = 0.0 if se_cortan(a, b, c, d) else min(dist_ps(a, c, d), dist_ps(b, c, d), dist_ps(c, a, b), dist_ps(d, a, b))
        out.append(f"{r + 1e-12:.2f}")
    print("\n".join(out))


main()
