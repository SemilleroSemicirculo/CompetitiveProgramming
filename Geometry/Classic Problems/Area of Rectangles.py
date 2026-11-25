import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Línea de barrido + Segment Tree de cobertura (área de la unión de rectángulos)
 * Problema  : CSES 1741 - Area of Rectangles (https://cses.fi/problemset/task/1741)
 * Entrada   : n, luego n rectángulos "x1 y1 x2 y2"
 * Salida    : el área total cubierta por la unión
 * Complejidad: tiempo O(n log n), memoria O(n)
"""


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    v = list(map(int, data[1:1 + 4 * n]))
    ys = sorted(set(v[1::4]) | set(v[3::4]))  # alturas comprimidas
    pos = {y: i for i, y in enumerate(ys)}
    m = len(ys) - 1  # intervalos elementales [ys[i], ys[i+1])
    sz = 1
    while sz < m:
        sz <<= 1
    # W[v] = ancho del tramo del nodo, cnt[v] = rectángulos que lo cubren entero, L[v] = largo cubierto
    W = [0] * (2 * sz)
    for i in range(m):
        W[sz + i] = ys[i + 1] - ys[i]
    for u in range(sz - 1, 0, -1):
        W[u] = W[2 * u] + W[2 * u + 1]
    cnt = [0] * (2 * sz)
    L = [0] * (2 * sz)

    def pull(u):
        if cnt[u]:
            L[u] = W[u]          # cubierto entero
        elif u < sz:
            L[u] = L[2 * u] + L[2 * u + 1]
        else:
            L[u] = 0

    # eventos: (x, delta, y1, y2), se suman las franjas entre x consecutivos
    ev = sorted([(v[k], 1, v[k + 1], v[k + 3]) for k in range(0, 4 * n, 4)] +
                [(v[k + 2], -1, v[k + 1], v[k + 3]) for k in range(0, 4 * n, 4)])
    area = 0
    prev = ev[0][0]
    for x, d, y1, y2 in ev:
        area += L[1] * (x - prev)
        prev = x
        # segment tree iterativo: se marcan los nodos que cubren [a, b) y se recalculan sus ancestros
        l, r = pos[y1] + sz, pos[y2] + sz
        l0, r0 = l, r - 1
        while l < r:
            if l & 1:
                cnt[l] += d
                pull(l)
                l += 1
            if r & 1:
                r -= 1
                cnt[r] += d
                pull(r)
            l >>= 1
            r >>= 1
        l0 >>= 1
        while l0:
            pull(l0)
            l0 >>= 1
        r0 >>= 1
        while r0:
            pull(r0)
            r0 >>= 1
    print(area)


main()
