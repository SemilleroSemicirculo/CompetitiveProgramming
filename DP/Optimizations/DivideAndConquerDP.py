import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Optimización de DP con divide y vencerás (el corte óptimo es monótono)
 * Problema  : CSES 2086 - Subarray Squares (https://cses.fi/problemset/task/2086)
 * Entrada   : n, k; el arreglo x_1 … x_n
 * Salida    : el mínimo de la suma de los cuadrados de las sumas al partir el arreglo en k tramos
 * Complejidad: tiempo O(k · n log n), memoria O(n)
"""


def main():
    n, k = map(int, input().split())
    pre = [0]
    for x in map(int, input().split()):
        pre.append(pre[-1] + x)
    ant = [INF] * (n + 1)
    ant[0] = 0
    for _ in range(k):
        cur = [INF] * (n + 1)
        pila = [(1, n, 0, n - 1)]          # (lo, hi, optl, optr) sin recursión
        while pila:
            lo, hi, optl, optr = pila.pop()
            if lo > hi:
                continue
            mid = (lo + hi) // 2
            best, bv = optl, INF
            pm = pre[mid]
            for p in range(optl, min(mid - 1, optr) + 1):
                a = ant[p]
                if a != INF:
                    d = pm - pre[p]
                    v = a + d * d
                    if v < bv:
                        bv, best = v, p
            cur[mid] = bv
            pila.append((lo, mid - 1, optl, best))
            pila.append((mid + 1, hi, best, optr))
        ant = cur
    print(ant[n])


main()
