import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Punto en polígono (ray casting con producto cruz)
 * Problema  : CSES 2192 - Point in Polygon (https://cses.fi/problemset/task/2192)
 * Entrada   : n m, luego n vértices del polígono y m puntos "x y"
 * Salida    : INSIDE, OUTSIDE o BOUNDARY para cada punto
 * Complejidad: tiempo O(n · m), memoria O(n)
"""


# producto cruz (b - a) x (c - a)
def cross(a, b, c):
    return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])


# p está en el segmento ab: colineal y dentro de su caja
def on_segment(a, b, p):
    return (cross(a, b, p) == 0 and min(a[0], b[0]) <= p[0] <= max(a[0], b[0])
            and min(a[1], b[1]) <= p[1] <= max(a[1], b[1]))


def main():
    n, m = map(int, input().split())
    poly = [tuple(map(int, input().split())) for _ in range(n)]
    out = []
    for _ in range(m):
        p = tuple(map(int, input().split()))
        boundary = False
        crossings = 0
        for i in range(n):
            a, b = poly[i], poly[(i + 1) % n]
            # si está sobre una arista, es borde
            if on_segment(a, b, p):
                boundary = True
                break
            # rayo horizontal: se cuentan aristas que cruzan la altura de p a su derecha
            if (a[1] > p[1]) != (b[1] > p[1]):
                if (cross(a, b, p) > 0) == (b[1] > a[1]):
                    crossings += 1
        # cantidad impar de cruces = adentro
        out.append("BOUNDARY" if boundary else ("INSIDE" if crossings % 2 else "OUTSIDE"))
    print("\n".join(out))


main()
