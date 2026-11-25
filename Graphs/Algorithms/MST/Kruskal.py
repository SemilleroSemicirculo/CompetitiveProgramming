import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Kruskal (árbol de expansión mínima con DSU)
 * Problema  : CSES 1675 - Road Reparation (https://cses.fi/problemset/task/1675)
 * Entrada   : n m, luego m aristas "a b c" (costo c)
 * Salida    : el costo mínimo para conectar todo, o IMPOSSIBLE
 * Complejidad: tiempo O(m log m), memoria O(n + m)
"""


# DSU para detectar si una arista une componentes distintas
class DSU:
    def __init__(self, n):
        self.parent = list(range(n + 1))
        self.size = [1] * (n + 1)

    def find(self, x):
        root = x
        while self.parent[root] != root:
            root = self.parent[root]
        while self.parent[x] != root:
            self.parent[x], x = root, self.parent[x]
        return root

    def unite(self, a, b):
        a, b = self.find(a), self.find(b)
        if a == b:
            return False
        if self.size[a] < self.size[b]:
            a, b = b, a
        self.parent[b] = a
        self.size[a] += self.size[b]
        return True


def main():
    n, m = map(int, input().split())
    edges = []
    for _ in range(m):
        a, b, c = map(int, input().split())
        edges.append((c, a, b))
    # se procesan las aristas de menor a mayor peso
    edges.sort()

    dsu = DSU(n)
    total = used = 0
    for w, a, b in edges:
        # la arista se usa solo si no forma ciclo
        if dsu.unite(a, b):
            total += w
            used += 1
    # un árbol de expansión tiene n-1 aristas; si faltan, el grafo no es conexo
    print(total if used == n - 1 else "IMPOSSIBLE")


main()
