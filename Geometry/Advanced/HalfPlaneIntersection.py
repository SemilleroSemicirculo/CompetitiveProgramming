import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Intersección de semiplanos (ordenar por ángulo + deque), O(n log n)
 * Problema  : Problema propio: área común de n semiplanos dentro de la caja [−10^4, 10^4]²
 * Entrada   : n; luego n rectas dirigidas "x1 y1 x2 y2": se conserva el lado izquierdo de P1 → P2
 * Salida    : el área de la intersección, con 6 decimales (0 si es vacía)
 * Complejidad: tiempo O(n log n), memoria O(n)
"""
from math import atan2
from collections import deque


def main():
    data = sys.stdin.read().split()
    n = int(data[0])
    B = 10 ** 4
    H = [(-B, -B, B, -B), (B, -B, B, B), (B, B, -B, B), (-B, B, -B, -B)]
    for i in range(n):
        H.append(tuple(int(x) for x in data[1 + 4 * i:5 + 4 * i]))
    # recta = (px, py, dx, dy, ángulo)
    R = [(a, b, c - a, d - b, atan2(d - b, c - a)) for a, b, c, d in H]

    def cross(ax, ay, bx, by):
        return ax * by - ay * bx

    def fuera(h, q):                       # q a la derecha de h
        return cross(h[2], h[3], q[0] - h[0], q[1] - h[1]) < -1e-9

    def corte(a, b):
        t = cross(b[2], b[3], b[0] - a[0], b[1] - a[1]) / cross(b[2], b[3], a[2], a[3])
        return (a[0] + a[2] * t, a[1] + a[3] * t)

    R.sort(key=lambda h: h[4])
    U = []
    for h in R:                            # mismo ángulo: quedarse con la más restrictiva
        if U and abs(U[-1][4] - h[4]) < 1e-12:
            u = U[-1]
            if cross(u[2], u[3], h[0] - u[0], h[1] - u[1]) > 0:
                U[-1] = h
        else:
            U.append(h)
    dq = deque()
    for h in U:
        while len(dq) >= 2 and fuera(h, corte(dq[-1], dq[-2])):
            dq.pop()
        while len(dq) >= 2 and fuera(h, corte(dq[0], dq[1])):
            dq.popleft()
        if dq and abs(cross(dq[-1][2], dq[-1][3], h[2], h[3])) < 1e-12:
            b = dq[-1]
            if cross(b[2], b[3], h[0] - b[0], h[1] - b[1]) <= 0:
                print("0.000000")
                return
        dq.append(h)
    while len(dq) >= 3 and fuera(dq[0], corte(dq[-1], dq[-2])):
        dq.pop()
    while len(dq) >= 3 and fuera(dq[-1], corte(dq[0], dq[1])):
        dq.popleft()
    if len(dq) < 3:
        print("0.000000")
        return
    L = list(dq)
    poly = [corte(L[i], L[(i + 1) % len(L)]) for i in range(len(L))]
    area = sum(poly[i][0] * poly[(i + 1) % len(poly)][1] - poly[i][1] * poly[(i + 1) % len(poly)][0] for i in range(len(poly)))
    print(f"{max(0.0, area / 2):.6f}")


main()
