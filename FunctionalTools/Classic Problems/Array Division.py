import sys
from itertools import accumulate
from bisect import bisect_right

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Búsqueda binaria sobre la respuesta + verificación golosa
 * Problema  : CSES 1085 - Array Division (https://cses.fi/problemset/task/1085)
 * Entrada   : n k, luego n enteros positivos
 * Salida    : la menor suma máxima posible al partir el arreglo en k subarreglos
 * Complejidad: tiempo O(n log S) con S = suma total, memoria O(n)
"""


def main():
    data = sys.stdin.buffer.read().split()
    n, k = int(data[0]), int(data[1])
    x = list(map(int, data[2:2 + n]))
    p = [0] + list(accumulate(x))  # p[i] = x_1 + ... + x_i

    def cabe(L):
        """¿Se puede con suma máxima L? Cada parte se extiende lo más posible (salto con bisect)."""
        i, partes = 0, 0
        while i < n:
            partes += 1
            if partes > k:
                return False
            # la parte que empieza en i llega hasta el último j con p[j] - p[i] <= L
            i = bisect_right(p, p[i] + L) - 1
        return True

    # si L sirve, cualquier L mayor también: se busca el menor que sirve
    lo, hi = max(x), p[n]
    while lo < hi:
        mid = (lo + hi) // 2
        if cabe(mid):
            hi = mid
        else:
            lo = mid + 1
    print(lo)


main()
