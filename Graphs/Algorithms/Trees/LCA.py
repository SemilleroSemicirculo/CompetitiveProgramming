import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : LCA con binary lifting
 * Problema  : CSES 1688 - Company Queries II (https://cses.fi/problemset/task/1688)
 * Entrada   : n q, luego los jefes de 2..n y q consultas "a b"
 * Salida    : el ancestro común más bajo de cada consulta
 * Complejidad: tiempo O((n + q) log n), memoria O(n log n)
"""


def main():
    data = sys.stdin.buffer.read().split()
    n, q = int(data[0]), int(data[1])
    parent = [0, 1] + [int(x) for x in data[2:n + 1]]

    # profundidad con BFS desde la raíz (los jefes forman el árbol)
    children = [[] for _ in range(n + 1)]
    for v in range(2, n + 1):
        children[parent[v]].append(v)
    depth = [0] * (n + 1)
    order = [1]
    for u in order:
        for v in children[u]:
            depth[v] = depth[u] + 1
            order.append(v)

    # up[j][v] = ancestro 2^j veces arriba de v
    LOG = max(1, n.bit_length())
    up = [parent]
    for j in range(1, LOG):
        prev = up[-1]
        up.append([prev[prev[v]] for v in range(n + 1)])

    # LCA: se igualan profundidades y luego se sube a la vez mientras los ancestros difieran
    def lca(a, b):
        if depth[a] < depth[b]:
            a, b = b, a
        diff = depth[a] - depth[b]
        j = 0
        while diff:
            if diff & 1:
                a = up[j][a]
            diff >>= 1
            j += 1
        if a == b:
            return a
        for j in range(LOG - 1, -1, -1):
            if up[j][a] != up[j][b]:
                a, b = up[j][a], up[j][b]
        return parent[a]

    out = []
    pos = n + 1
    for _ in range(q):
        a, b = int(data[pos]), int(data[pos + 1])
        pos += 2
        out.append(lca(a, b))
    print("\n".join(map(str, out)))


main()
