import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Línea de barrido + Fenwick Tree (cruces entre segmentos horizontales y verticales)
 * Problema  : CSES 1740 - Intersection Points (https://cses.fi/problemset/task/1740)
 * Entrada   : n, luego n segmentos horizontales o verticales "x1 y1 x2 y2"
 * Salida    : cantidad de puntos de intersección
 * Complejidad: tiempo O(n log n), memoria O(n)
"""


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    v = list(map(int, data[1:1 + 4 * n]))
    # se comprimen las alturas de las horizontales para que el Fenwick sea pequeño
    ys = sorted({v[k + 1] for k in range(0, 4 * n, 4) if v[k + 1] == v[k + 3]})
    from bisect import bisect_left, bisect_right
    idx = {y: i + 1 for i, y in enumerate(ys)}
    m = len(ys)
    # eventos codificados en un entero para ordenar rápido: (x, tipo, índice del segmento)
    # tipo 0 = empieza horizontal, 1 = vertical (consulta), 2 = termina horizontal
    ev = []
    for k in range(0, 4 * n, 4):
        x1, y1, x2, y2 = v[k], v[k + 1], v[k + 2], v[k + 3]
        if y1 == y2:
            ev.append(((x1 + 1000000) * 3) * n + k // 4)
            ev.append(((x2 + 1000000) * 3 + 2) * n + k // 4)
        else:
            ev.append(((x1 + 1000000) * 3 + 1) * n + k // 4)
    ev.sort()
    bit = [0] * (m + 1)
    total = 0
    for e in ev:
        t = e // n % 3
        k = 4 * (e % n)
        if t == 1:
            # horizontales activas con altura en [y1, y2]
            hi = bisect_right(ys, v[k + 3])
            lo = bisect_left(ys, v[k + 1])
            s = 0
            while hi > 0:
                s += bit[hi]
                hi -= hi & -hi
            while lo > 0:
                s -= bit[lo]
                lo -= lo & -lo
            total += s
        else:
            i, d = idx[v[k + 1]], (1 if t == 0 else -1)
            while i <= m:
                bit[i] += d
                i += i & -i
    print(total)


main()
