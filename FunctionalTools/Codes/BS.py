import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Búsqueda binaria manual
 * Problema  : Sin problema equivalente en CSES; formato propio
 * Entrada   : n target, luego n enteros ordenados
 * Salida    : FOUND at index i, o NOT FOUND
 * Complejidad: tiempo O(log n), memoria O(n)
"""


# mitad del rango en cada paso: se descarta la mitad donde no puede estar
def binary_search_manual(a, target):
    lo, hi = 0, len(a) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if a[mid] == target:
            return mid
        if a[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1


def main():
    data = sys.stdin.read().split()
    n, target = int(data[0]), int(data[1])
    a = list(map(int, data[2:2 + n]))
    # la búsqueda exige el arreglo ordenado
    idx = binary_search_manual(a, target)
    print("FOUND at index %d" % idx if idx != -1 else "NOT FOUND")


main()
