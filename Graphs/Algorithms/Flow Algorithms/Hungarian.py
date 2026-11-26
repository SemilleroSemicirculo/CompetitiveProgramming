import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Algoritmo húngaro (asignación de costo mínimo con potenciales)
 * Problema  : CSES 2129 - Task Assignment (https://cses.fi/problemset/task/2129)
 * Entrada   : n; luego la matriz n × n con el costo c[i][j] de que el empleado i haga la tarea j
 * Salida    : el costo mínimo total y luego n parejas "empleado tarea"
 * Complejidad: tiempo O(n³), memoria O(n²)
"""


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    c = [[0] * (n + 1)] + [[0] + [int(x) for x in data[1 + i * n:1 + (i + 1) * n]] for i in range(n)]
    u = [0] * (n + 1)
    v = [0] * (n + 1)
    p = [0] * (n + 1)
    way = [0] * (n + 1)
    for i in range(1, n + 1):
        p[0] = i
        j0 = 0
        minv = [INF] * (n + 1)
        used = [False] * (n + 1)
        while True:
            used[j0] = True
            i0 = p[j0]
            ci, ui = c[i0], u[i0]
            delta, j1 = INF, 0
            for j in range(1, n + 1):
                if not used[j]:
                    cur = ci[j] - ui - v[j]
                    if cur < minv[j]:
                        minv[j] = cur
                        way[j] = j0
                    if minv[j] < delta:
                        delta, j1 = minv[j], j
            for j in range(n + 1):
                if used[j]:
                    u[p[j]] += delta
                    v[j] -= delta
                else:
                    minv[j] -= delta
            j0 = j1
            if p[j0] == 0:
                break
        while j0:
            j1 = way[j0]
            p[j0] = p[j1]
            j0 = j1
    tarea = [0] * (n + 1)
    total = 0
    for j in range(1, n + 1):
        tarea[p[j]] = j
        total += c[p[j]][j]
    print("\n".join([str(total)] + [f"{i} {tarea[i]}" for i in range(1, n + 1)]))


main()
