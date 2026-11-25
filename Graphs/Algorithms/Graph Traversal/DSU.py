import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : DSU (Union-Find con compresión de caminos y unión por tamaño)
 * Problema  : CSES 1676 - Road Construction (https://cses.fi/problemset/task/1676)
 * Entrada   : n m, luego m aristas "a b"
 * Salida    : tras cada arista: cantidad de componentes y tamaño de la componente más grande
 * Complejidad: tiempo O(m α(n)), memoria O(n)
"""


# Union-Find: parent[x] es el padre en el bosque y size el tamaño de cada conjunto
class DSU:
    def __init__(self, n):
        self.parent = list(range(n + 1))
        self.size = [1] * (n + 1)

    # compresión de caminos (iterativa)
    def find(self, x):
        root = x
        while self.parent[root] != root:
            root = self.parent[root]
        while self.parent[x] != root:
            self.parent[x], x = root, self.parent[x]
        return root

    # unión por tamaño: el conjunto pequeño se cuelga del grande
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
    dsu = DSU(n)
    # comps = componentes actuales, biggest = tamaño de la mayor
    comps, biggest = n, 1
    out = []
    for _ in range(m):
        a, b = map(int, input().split())
        if dsu.unite(a, b):
            comps -= 1
            biggest = max(biggest, dsu.size[dsu.find(a)])
        out.append("%d %d" % (comps, biggest))
    print("\n".join(out))


main()
