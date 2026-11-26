import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Slope trick (la DP es una función convexa por tramos; se guardan solo sus puntos de quiebre en un heap)
 * Problema  : Codeforces 713C - Sonya and Problem Wihtout a Legend (https://codeforces.com/problemset/problem/713/C)
 * Entrada   : n; a_1 … a_n
 * Salida    : el mínimo de operaciones ±1 para que el arreglo quede estrictamente creciente
 * Complejidad: tiempo O(n log n), memoria O(n)
"""
import heapq


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    pq = []                               # max-heap con valores negados
    ans = 0
    for i in range(n):
        x = int(data[1 + i]) - i
        heapq.heappush(pq, -x)
        if -pq[0] > x:
            ans += -pq[0] - x
            heapq.heapreplace(pq, -x)
    print(ans)


main()
