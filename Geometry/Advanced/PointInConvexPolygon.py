import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Punto dentro de un polígono convexo en O(log n) (búsqueda binaria por ángulo)
 * Problema  : Codeforces 166B - Polygons (https://codeforces.com/problemset/problem/166/B)
 * Entrada   : n y el polígono A estrictamente convexo (sentido horario); m y el polígono B
 * Salida    : YES si todos los vértices de B están estrictamente dentro de A; si no, NO
 * Complejidad: tiempo O(n + m log n), memoria O(n)
"""


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    A = [(int(data[1 + 2 * i]), int(data[2 + 2 * i])) for i in range(n)][::-1]   # a antihorario
    p = 1 + 2 * n
    m = int(data[p]); p += 1
    x0, y0 = A[0]
    vx = [a[0] - x0 for a in A]           # vectores desde el pivote
    vy = [a[1] - y0 for a in A]
    for i in range(m):
        px, py = int(data[p + 2 * i]) - x0, int(data[p + 2 * i + 1]) - y0
        if vx[1] * py - vy[1] * px <= 0 or vx[n - 1] * py - vy[n - 1] * px >= 0:
            print("NO")
            return
        lo, hi = 1, n - 1
        while hi - lo > 1:
            mid = (lo + hi) // 2
            if vx[mid] * py - vy[mid] * px > 0:
                lo = mid
            else:
                hi = mid
        ex, ey = vx[lo + 1] - vx[lo], vy[lo + 1] - vy[lo]
        if ex * (py - vy[lo]) - ey * (px - vx[lo]) <= 0:
            print("NO")
            return
    print("YES")


main()
