import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Isomorfismo de árboles con raíz (ids canónicos compartidos)
 * Problema  : CSES 1700 - Tree Isomorphism I (https://cses.fi/problemset/task/1700)
 * Entrada   : t casos: n, luego n-1 aristas del primer árbol y n-1 del segundo (ambos con raíz 1)
 * Salida    : YES si los árboles con raíz son isomorfos, NO si no
 * Complejidad: tiempo O(n log n), memoria O(n)
"""


# id canónico de la raíz: depende de los ids ordenados de los hijos (de las hojas hacia la raíz)
def canonical(G, root, ids):
    n = len(G) - 1
    parent = [0] * (n + 1)
    parent[root] = -1
    order = [root]
    for u in order:
        for v in G[u]:
            if v != parent[u]:
                parent[v] = u
                order.append(v)
    children = [[] for _ in range(n + 1)]
    cid = [0] * (n + 1)
    for u in reversed(order):
        key = tuple(sorted(children[u]))
        # cada lista ordenada de ids de hijos recibe un id único
        if key not in ids:
            ids[key] = len(ids)
        cid[u] = ids[key]
        if parent[u] > 0:
            children[parent[u]].append(cid[u])
    return cid[root]


def read_tree(data, pos, n):
    G = [[] for _ in range(n + 1)]
    for _ in range(n - 1):
        a, b = int(data[pos]), int(data[pos + 1])
        pos += 2
        G[a].append(b)
        G[b].append(a)
    return G, pos


def main():
    data = sys.stdin.buffer.read().split()
    t = int(data[0])
    pos = 1
    out = []
    for _ in range(t):
        n = int(data[pos])
        pos += 1
        A, pos = read_tree(data, pos, n)
        B, pos = read_tree(data, pos, n)
        # ids compartido entre los dos árboles de cada caso
        ids = {}
        # árboles con raíz isomorfos si las raíces tienen el mismo id
        out.append("YES" if canonical(A, 1, ids) == canonical(B, 1, ids) else "NO")
    print("\n".join(out))


main()
