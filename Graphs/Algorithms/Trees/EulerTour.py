import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Euler Tour + Fenwick Tree (consultas sobre subárboles)
 * Problema  : CSES 1137 - Subtree Queries (https://cses.fi/problemset/task/1137)
 * Entrada   : n q, n valores, n-1 aristas y q consultas: "1 s x" (valor del nodo s = x) o "2 s" (suma del subárbol de s)
 * Salida    : la suma de cada consulta de tipo 2
 * Complejidad: tiempo O((n + q) log n), memoria O(n)
"""


def main():
    data = sys.stdin.buffer.read().split()
    n, q = int(data[0]), int(data[1])
    val = [0] + [int(x) for x in data[2:n + 2]]
    G = [[] for _ in range(n + 1)]
    pos = n + 2
    for _ in range(n - 1):
        a, b = int(data[pos]), int(data[pos + 1])
        pos += 2
        G[a].append(b)
        G[b].append(a)

    # tin[u]/tout[u] = intervalo del subárbol de u en el recorrido (DFS iterativo)
    tin = [0] * (n + 1)
    tout = [0] * (n + 1)
    parent = [0] * (n + 1)
    timer = 1
    tin[1] = 1
    st = [(1, 0)]
    while st:
        u, i = st[-1]
        if i < len(G[u]):
            st[-1] = (u, i + 1)
            v = G[u][i]
            if v != parent[u]:
                parent[v] = u
                timer += 1
                tin[v] = timer
                st.append((v, 0))
        else:
            tout[u] = timer
            st.pop()

    # Fenwick Tree sobre las posiciones del recorrido
    bit = [0] * (n + 1)

    def add(i, v):
        while i <= n:
            bit[i] += v
            i += i & -i

    def prefix(i):
        s = 0
        while i > 0:
            s += bit[i]
            i -= i & -i
        return s

    # cada nodo ocupa la posición tin[i]
    for v in range(1, n + 1):
        add(tin[v], val[v])

    out = []
    for _ in range(q):
        t = int(data[pos])
        s = int(data[pos + 1])
        if t == 1:
            # actualizar un nodo = sumar la diferencia en su posición
            x = int(data[pos + 2])
            pos += 3
            add(tin[s], x - val[s])
            val[s] = x
        else:
            # consultar = suma del intervalo del subárbol
            pos += 2
            out.append(prefix(tout[s]) - prefix(tin[s] - 1))
    print("\n".join(map(str, out)))


main()
