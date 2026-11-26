import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Componentes biconexas (bloques) con Tarjan; los bloques y los puntos de articulación forman el block-cut tree
 * Problema  : Library Checker - Biconnected Components (https://judge.yosupo.jp/problem/biconnected_components)
 * Entrada   : N M; M aristas no dirigidas "a b" (0-indexadas; puede haber lazos y repetidas)
 * Salida    : K, la cantidad de bloques, y K líneas "l v_1 … v_l" con los vértices de cada bloque
 *             (un vértice aislado es un bloque por sí solo)
 * Complejidad: tiempo O(N + M), memoria O(N + M)
"""


def main():
    data = sys.stdin.buffer.read().split()
    n, m = int(data[0]), int(data[1])
    g = [[] for _ in range(n)]
    for i in range(m):
        a, b = int(data[2 + 2 * i]), int(data[3 + 2 * i])
        if a != b:
            g[a].append((b, i))
            g[b].append((a, i))
    tin = [-1] * n
    low = [0] * n
    bloques = []
    t = 0
    for r in range(n):
        if tin[r] >= 0:
            continue
        if not g[r]:
            tin[r] = t
            t += 1
            bloques.append([r])
            continue
        tin[r] = low[r] = t
        t += 1
        pila = [r]
        st = [[r, -1, 0]]
        while st:
            top = st[-1]
            u = top[0]
            if top[2] < len(g[u]):
                v, eid = g[u][top[2]]
                top[2] += 1
                if eid == top[1]:
                    continue
                if tin[v] >= 0:
                    if tin[v] < low[u]:
                        low[u] = tin[v]
                    continue
                tin[v] = low[v] = t
                t += 1
                pila.append(v)
                st.append([v, eid, 0])
            else:
                st.pop()
                if not st:
                    break
                p = st[-1][0]
                if low[u] < low[p]:
                    low[p] = low[u]
                if low[u] >= tin[p]:
                    b = [p]
                    while True:
                        x = pila.pop()
                        b.append(x)
                        if x == u:
                            break
                    bloques.append(b)
    out = [str(len(bloques))]
    for b in bloques:
        out.append(f"{len(b)} " + " ".join(map(str, b)))
    print("\n".join(out))


main()
