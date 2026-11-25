import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : DFS (componentes conexas)
 * Problema  : CSES 1666 - Building Roads (https://cses.fi/problemset/task/1666)
 * Entrada   : n m, luego m aristas "a b"
 * Salida    : cantidad mínima de caminos a construir y las aristas que conectan las componentes
 * Complejidad: tiempo O(n + m), memoria O(n + m)
"""


def main():
    n, m = map(int, input().split())
    G = [[] for _ in range(n + 1)]
    for _ in range(m):
        a, b = map(int, input().split())
        G[a].append(b)
        G[b].append(a)

    # visited[u] indica si u ya fue explorado
    visited = [False] * (n + 1)
    # un representante por cada componente conexa
    reps = []
    for s in range(1, n + 1):
        if visited[s]:
            continue
        reps.append(s)
        # DFS iterativo con pila: explora toda la componente de s
        visited[s] = True
        st = [s]
        while st:
            u = st.pop()
            for v in G[u]:
                if not visited[v]:
                    visited[v] = True
                    st.append(v)

    # se necesitan (componentes - 1) caminos para unirlas
    out = [str(len(reps) - 1)]
    for i in range(1, len(reps)):
        out.append("%d %d" % (reps[i - 1], reps[i]))
    print("\n".join(out))


main()
