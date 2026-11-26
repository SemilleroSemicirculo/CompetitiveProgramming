import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Rotating calipers sobre la envolvente convexa (par de puntos más lejano)
 * Problema  : Kattis - Robert Hood (https://open.kattis.com/problems/roberthood)
 * Entrada   : C; luego C puntos enteros x y
 * Salida    : la mayor distancia entre dos de los puntos
 * Complejidad: tiempo O(C log C) por la envolvente; los calibradores son O(h), memoria O(C)
"""
from math import sqrt


def cross(o, a, b):
    return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])


def hull(p):
    p = sorted(set(p))
    if len(p) < 3:
        return p
    abajo, arriba = [], []
    for q in p:
        while len(abajo) >= 2 and cross(abajo[-2], abajo[-1], q) <= 0:
            abajo.pop()
        abajo.append(q)
    for q in reversed(p):
        while len(arriba) >= 2 and cross(arriba[-2], arriba[-1], q) <= 0:
            arriba.pop()
        arriba.append(q)
    return abajo[:-1] + arriba[:-1]


def main():
    data = sys.stdin.buffer.read().split()
    c = int(data[0])
    pts = [(int(data[1 + 2 * i]), int(data[2 + 2 * i])) for i in range(c)]
    h = hull(pts)
    n = len(h)

    def d2(a, b):
        return (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2

    if n <= 2:
        best = d2(h[0], h[1]) if n == 2 else 0
    else:
        best, j = 0, 1
        for i in range(n):
            a, b = h[i], h[(i + 1) % n]
            while cross(a, b, h[(j + 1) % n]) > cross(a, b, h[j]):   # el área crece: avanzar
                j = (j + 1) % n
            best = max(best, d2(a, h[j]), d2(b, h[j]))
    print(f"{sqrt(best):.8f}")


main()
