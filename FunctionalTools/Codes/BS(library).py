import sys
from bisect import bisect_left

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Búsqueda binaria con la librería (binary_search / lower_bound)
 * Problema  : Sin problema equivalente en CSES; formato propio
 * Entrada   : n target, luego n enteros ordenados
 * Salida    : FOUND y su índice, o NOT FOUND
 * Complejidad: tiempo O(log n), memoria O(n)
"""


def main():
    data = sys.stdin.read().split()
    n, target = int(data[0]), int(data[1])
    a = list(map(int, data[2:2 + n]))
    # bisect_left da la primera posición con valor >= target
    idx = bisect_left(a, target)
    # el valor existe si en esa posición está justo target
    if idx < n and a[idx] == target:
        print("FOUND")
        print("at index %d" % idx)
    else:
        print("NOT FOUND")


main()
