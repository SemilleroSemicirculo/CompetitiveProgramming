import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Envolvente convexa (Graham scan, incluye puntos colineales del borde)
 * Problema  : CSES 2195 - Convex Hull (https://cses.fi/problemset/task/2195)
 * Entrada   : n, luego n puntos enteros "x y"
 * Salida    : cantidad de puntos de la envolvente (incluye los del borde) y sus coordenadas
 * Complejidad: tiempo O(n log n), memoria O(n)
"""


# producto cruz (a - o) x (b - o): > 0 antihorario, < 0 horario, 0 colineal
def cross(o, a, b):
    return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])


# cadena monótona (Andrew): se ordenan los puntos y se arman la parte de abajo y la de arriba
# (versión más rápida en Python que el Graham scan; con include_collinear se dejan los puntos del borde)
def convex_hull(pts, include_collinear=False):
    pts = sorted(set(pts))
    if len(pts) <= 2:
        return pts

    def half(points):
        st = []
        for p in points:
            # se saca el último mientras el giro no sea antihorario (o colineal si se excluyen)
            while len(st) > 1:
                c = cross(st[-2], st[-1], p)
                if c > 0 or (include_collinear and c == 0):
                    break
                st.pop()
            st.append(p)
        return st

    lower = half(pts)
    upper = half(reversed(pts))
    hull = lower[:-1] + upper[:-1]
    # si todos son colineales, cada punto quedó dos veces
    if include_collinear and len(hull) > len(pts):
        return pts
    return hull


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    points = list(zip(map(int, data[1:2 * n + 1:2]), map(int, data[2:2 * n + 2:2])))
    hull = convex_hull(points, True)
    out = [str(len(hull))] + ["%d %d" % p for p in hull]
    print("\n".join(out))


main()
