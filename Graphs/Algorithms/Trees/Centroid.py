import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Centroide de un árbol (tamaños de subárbol)
 * Problema  : CSES 2079 - Finding a Centroid (https://cses.fi/problemset/task/2079)
 * Entrada   : n, luego n-1 aristas "a b"
 * Salida    : un centroide
 * Complejidad: tiempo O(n), memoria O(n)
"""


def main():
    n = int(input())
    G = [[] for _ in range(n + 1)]
    for _ in range(n - 1):
        a, b = map(int, input().split())
        G[a].append(b)
        G[b].append(a)

    # recorrido iterativo: order guarda los nodos en preorden y parent su padre
    parent = [0] * (n + 1)
    order = [1]
    for u in order:
        for v in G[u]:
            if v != parent[u]:
                parent[v] = u
                order.append(v)

    # dp[u] = tamaño del subárbol de u (se llena de las hojas hacia la raíz)
    dp = [1] * (n + 1)
    for u in reversed(order):
        if u != 1:
            dp[parent[u]] += dp[u]

    # centroide: ningún subárbol puede tener más de n/2 nodos
    limit = n // 2
    u = 1
    # se baja siempre hacia el hijo con subárbol demasiado grande
    while True:
        nxt = 0
        for v in G[u]:
            if v != parent[u] and dp[v] > limit:
                nxt = v
                break
        if nxt == 0:
            break
        u = nxt
    print(u)


main()
