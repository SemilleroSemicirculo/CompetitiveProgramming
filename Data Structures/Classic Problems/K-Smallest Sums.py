import sys
import heapq

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : K menores sumas con heap (fusión de dos listas ordenadas)
 * Problema  : UVa 11997 - K Smallest Sums
 * Entrada   : varios casos: k, luego k filas de k enteros
 * Salida    : las k menores sumas posibles (una por columna), por caso
 * Complejidad: tiempo O(k^2 log k), memoria O(k)
"""


# mezcla dos listas ordenadas y devuelve las k menores sumas a[i] + b[j]
def merge(a, b, k):
    # la menor suma posible es a[0] + b[0]
    heap = [(a[0] + b[0], 0, 0)]
    vis = {(0, 0)}
    res = []
    while len(res) < k:
        # se saca la menor suma pendiente
        s, i, j = heapq.heappop(heap)
        res.append(s)
        # se agregan los dos vecinos (i+1, j) y (i, j+1); vis evita repetirlos
        if i + 1 < k and (i + 1, j) not in vis:
            vis.add((i + 1, j))
            heapq.heappush(heap, (a[i + 1] + b[j], i + 1, j))
        if j + 1 < k and (i, j + 1) not in vis:
            vis.add((i, j + 1))
            heapq.heappush(heap, (a[i] + b[j + 1], i, j + 1))
    return res


def main():
    data = sys.stdin.read().split()
    pos = 0
    out = []
    # varios casos: se mezcla fila por fila quedándose siempre con las k menores
    while pos < len(data):
        k = int(data[pos])
        pos += 1
        rows = []
        for _ in range(k):
            rows.append(sorted(map(int, data[pos:pos + k])))
            pos += k
        cur = rows[0]
        for i in range(1, k):
            cur = merge(cur, rows[i], k)
        out.append(" ".join(map(str, cur)))
    print("\n".join(out))


main()
