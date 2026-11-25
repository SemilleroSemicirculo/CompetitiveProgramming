import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Intersección de segmentos (orientaciones y cajas envolventes)
 * Problema  : CSES 2190 - Line Segment Intersection (https://cses.fi/problemset/task/2190)
 * Entrada   : t casos con "x1 y1 x2 y2 x3 y3 x4 y4"
 * Salida    : YES si los segmentos se intersectan (incluye tocarse), NO si no
 * Complejidad: tiempo O(1) por caso, memoria O(1)
"""


def main():
    data = list(map(int, sys.stdin.buffer.read().split()))
    t = data[0]
    out = []
    i = 1
    for _ in range(t):
        x1, y1, x2, y2, x3, y3, x4, y4 = data[i], data[i + 1], data[i + 2], data[i + 3], data[i + 4], data[i + 5], data[i + 6], data[i + 7]
        i += 8
        # los rectángulos de los segmentos deben solaparse (caso colineal)
        if (max(min(x1, x2), min(x3, x4)) > min(max(x1, x2), max(x3, x4))
                or max(min(y1, y2), min(y3, y4)) > min(max(y1, y2), max(y3, y4))):
            out.append("NO")
            continue
        # orientaciones (productos cruz) de cada extremo respecto al otro segmento
        d1 = (x2 - x1) * (y3 - y1) - (y2 - y1) * (x3 - x1)
        d2 = (x2 - x1) * (y4 - y1) - (y2 - y1) * (x4 - x1)
        d3 = (x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)
        d4 = (x4 - x3) * (y2 - y3) - (y4 - y3) * (x2 - x3)
        # los extremos de cada segmento quedan a lados opuestos del otro (o tocan)
        ok = ((d1 >= 0 and d2 <= 0) or (d1 <= 0 and d2 >= 0)) and ((d3 >= 0 and d4 <= 0) or (d3 <= 0 and d4 >= 0))
        out.append("YES" if ok else "NO")
    sys.stdout.write("\n".join(out) + "\n")


main()
