import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Isomorfismo de árboles sin raíz (centroides + IDs canónicos)
 * Problema  : CSES 1701 - Tree Isomorphism II (https://cses.fi/problemset/task/1701)
 * Entrada   : t casos; cada uno: n, aristas del primer árbol y aristas del segundo
 * Salida    : YES o NO por caso
 * Complejidad: tiempo O(n log n) por caso, memoria O(n)
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


# centroides: nodos donde ningún pedazo al quitarlos tiene más de n/2 nodos
def centroids(G):
    n = len(G) - 1
    parent = [0] * (n + 1)
    order = [1]
    for u in order:
        for v in G[u]:
            if v != parent[u]:
                parent[v] = u
                order.append(v)
    size = [1] * (n + 1)
    res = []
    for u in reversed(order):
        biggest = n - size[u]
        for v in G[u]:
            if v != parent[u]:
                biggest = max(biggest, size[v])
        if parent[u]:
            size[parent[u]] += size[u]
        if biggest <= n // 2:
            res.append(u)
    return res


def main():
    data = sys.stdin.buffer.read().split()
    t = int(data[0])
    pos = 1
    out = []
    # se resuelve cada caso de prueba por separado
    for _ in range(t):
        n = int(data[pos])
        pos += 1
        A, pos = read_tree(data, pos, n)
        B, pos = read_tree(data, pos, n)
        # ids compartido: el id de B se calcula una vez desde su primer centroide
        # y se compara contra cada centroide de A
        ids = {}
        target = canonical(B, centroids(B)[0], ids)
        ans = "NO"
        for ca in centroids(A):
            if canonical(A, ca, ids) == target:
                ans = "YES"
                break
        out.append(ans)
    print("\n".join(out))


main()
