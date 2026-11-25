import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Sweep line (eventos ordenados)
 * Problema  : CSES 1619 - Restaurant Customers (https://cses.fi/problemset/task/1619)
 * Entrada   : n, luego n pares "llegada salida"
 * Salida    : máxima cantidad de clientes simultáneos
 * Complejidad: tiempo O(n log n), memoria O(n)
"""


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    # eventos: llegadas y salidas, cada lista ordenada por tiempo
    arr = sorted(map(int, data[1:2 * n + 1:2]))
    dep = sorted(map(int, data[2:2 * n + 2:2]))

    # se recorren los eventos en orden; a igual tiempo, las salidas van antes que las llegadas
    cur = best = 0
    j = 0
    for t in arr:
        while dep[j] <= t:
            cur -= 1
            j += 1
        # cur = clientes presentes en este momento
        cur += 1
        if cur > best:
            best = cur
    print(best)


main()
