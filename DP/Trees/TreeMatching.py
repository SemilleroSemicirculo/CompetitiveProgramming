import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : DP en árboles (dos estados por nodo: libre o emparejado con un hijo)
 * Problema  : CSES 1130 - Tree Matching (https://cses.fi/problemset/task/1130)
 * Entrada   : n; luego n − 1 aristas a b del árbol
 * Salida    : el máximo número de parejas de nodos vecinos sin repetir nodos (emparejamiento máximo)
 * Complejidad: tiempo O(n), memoria O(n)
"""


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    g = [[] for _ in range(n + 1)]
    for i in range(n - 1):
        a, b = int(data[1 + 2 * i]), int(data[2 + 2 * i])
        g[a].append(b)
        g[b].append(a)
    par = [0] * (n + 1)
    par[1] = -1
    orden, st = [], [1]
    while st:
        u = st.pop()
        orden.append(u)
        for v in g[u]:
            if v != par[u]:
                par[v] = u
                st.append(v)
    libre = [0] * (n + 1)
    usado = [0] * (n + 1)
    for u in reversed(orden):            # hijos antes que padres
        suma, mejora = 0, -1
        for v in g[u]:
            if v != par[u]:
                m = max(libre[v], usado[v])
                suma += m
                mejora = max(mejora, libre[v] + 1 - m)   # ganancia de emparejar u con v
        libre[u] = suma
        usado[u] = suma + mejora if mejora >= 0 else 0
    print(max(libre[1], usado[1]))


main()
