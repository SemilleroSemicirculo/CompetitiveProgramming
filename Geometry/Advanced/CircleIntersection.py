import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Intersección de dos circunferencias (casos exactos con enteros, puntos con flotantes)
 * Problema  : Problema propio: dos circunferencias con centro y radio enteros (|coord|, r ≤ 10^4)
 * Entrada   : T casos; cada uno x1 y1 r1 x2 y2 r2
 * Salida    : "INFINITE" si son la misma; si no, k (0, 1 o 2) y los k puntos ordenados, con 6 decimales
 * Complejidad: tiempo O(1) por caso, memoria O(1)
"""
from math import sqrt


def f6(x):
    return f"{0.0 if abs(x) < 5e-7 else x:.6f}"


def main():
    out = []
    for _ in range(int(input())):
        x1, y1, r1, x2, y2, r2 = map(int, input().split())
        dx, dy = x2 - x1, y2 - y1
        d2 = dx * dx + dy * dy
        if d2 == 0:
            out.append("INFINITE" if r1 == r2 else "0")
            continue
        suma, dif = (r1 + r2) ** 2, (r1 - r2) ** 2
        if d2 > suma or d2 < dif:
            out.append("0")
            continue
        d = sqrt(d2)
        a = (r1 * r1 - r2 * r2 + d2) / (2 * d)
        h = 0.0 if d2 in (suma, dif) else sqrt(max(0.0, r1 * r1 - a * a))
        mx, my = x1 + a * dx / d, y1 + a * dy / d
        pts = [(mx - h * dy / d, my + h * dx / d)]
        if h > 0:
            pts.append((mx + h * dy / d, my - h * dx / d))
        pts.sort()
        out.append(" ".join([str(len(pts))] + [f6(c) for p in pts for c in p]))
    print("\n".join(out))


main()
