import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Tamaños de subárbol en un árbol con raíz
 * Problema  : CSES 1674 - Subordinates (https://cses.fi/problemset/task/1674)
 * Entrada   : n, luego el jefe directo de cada empleado 2..n
 * Salida    : para cada empleado, la cantidad de subordinados (tamaño de su subárbol menos 1)
 * Complejidad: tiempo O(n), memoria O(n)
"""


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    boss = [0, 0] + list(map(int, data[1:n]))
    kids = [[] for _ in range(n + 1)]
    for v in range(2, n + 1):
        kids[boss[v]].append(v)
    # orden BFS desde el director: todo jefe aparece antes que sus subordinados
    order = [1]
    for u in order:
        order.extend(kids[u])
    # al revés: cuando se procesa a alguien, sus subordinados ya están contados
    sub = [0] * (n + 1)
    for v in reversed(order[1:]):
        sub[boss[v]] += sub[v] + 1
    print(*sub[1:])


main()
