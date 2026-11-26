import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Puentes de un grafo no dirigido (tiempos de descubrimiento y low, DFS sin recursión)
 * Problema  : CSES 2076 - Necessary Roads (https://cses.fi/problemset/task/2076)
 * Entrada   : n, m; luego m aristas a b (grafo conexo, sin aristas repetidas)
 * Salida    : la cantidad de puentes y cada puente "a b" (en cualquier orden)
 * Complejidad: tiempo O(n + m), memoria O(n + m)
"""


def main():
    data = sys.stdin.buffer.read().split()
    n, m = int(data[0]), int(data[1])
    g = [[] for _ in range(n + 1)]
    E = []
    for i in range(m):
        a, b = int(data[2 + 2 * i]), int(data[3 + 2 * i])
        E.append((a, b))
        g[a].append((b, i))
        g[b].append((a, i))
    tin = [0] * (n + 1)
    low = [0] * (n + 1)
    pe = [-1] * (n + 1)
    it = [0] * (n + 1)
    puentes = []
    timer = 0
    for s in range(1, n + 1):
        if tin[s]:
            continue
        timer += 1
        tin[s] = low[s] = timer
        st = [s]
        while st:
            u = st[-1]
            if it[u] < len(g[u]):
                v, idx = g[u][it[u]]
                it[u] += 1
                if idx == pe[u]:
                    continue
                if tin[v]:
                    if tin[v] < low[u]:
                        low[u] = tin[v]
                else:
                    timer += 1
                    tin[v] = low[v] = timer
                    pe[v] = idx
                    st.append(v)
            else:
                st.pop()
                if st:
                    p = st[-1]
                    if low[u] < low[p]:
                        low[p] = low[u]
                    if low[u] > tin[p]:
                        puentes.append(E[pe[u]])
    out = [str(len(puentes))] + [f"{a} {b}" for a, b in puentes]
    print("\n".join(out))


main()
