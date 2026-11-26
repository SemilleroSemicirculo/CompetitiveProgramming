import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Corte de un polígono convexo por una recta (Sutherland-Hodgman con un solo semiplano)
 * Problema  : Problema propio: polígono convexo y q rectas de corte (|coord| ≤ 10^4)
 * Entrada   : n y los n vértices en sentido antihorario; q; luego q rectas "x1 y1 x2 y2"
 * Salida    : para cada recta, el área de la parte del polígono a su izquierda (6 decimales)
 * Complejidad: tiempo O(n) por recta, memoria O(n)
"""


def cortar(poly, a, b):
    res = []
    n = len(poly)
    ux, uy = b[0] - a[0], b[1] - a[1]
    for i in range(n):
        c, d = poly[i], poly[(i + 1) % n]
        sc = ux * (c[1] - a[1]) - uy * (c[0] - a[0])
        sd = ux * (d[1] - a[1]) - uy * (d[0] - a[0])
        if sc >= 0:
            res.append(c)
        if (sc > 0 > sd) or (sc < 0 < sd):
            t = sc / (sc - sd)
            res.append((c[0] + (d[0] - c[0]) * t, c[1] + (d[1] - c[1]) * t))
    return res


def area(p):
    s = 0
    for i in range(len(p)):
        s += p[i][0] * p[(i + 1) % len(p)][1] - p[i][1] * p[(i + 1) % len(p)][0]
    return abs(s) / 2


def main():
    data = sys.stdin.read().split()
    n = int(data[0])
    poly = [(int(data[1 + 2 * i]), int(data[2 + 2 * i])) for i in range(n)]
    p = 1 + 2 * n
    q = int(data[p]); p += 1
    out = []
    for _ in range(q):
        x1, y1, x2, y2 = (int(x) for x in data[p:p + 4])
        p += 4
        out.append(f"{area(cortar(poly, (x1, y1), (x2, y2))):.6f}")
    print("\n".join(out))


main()
