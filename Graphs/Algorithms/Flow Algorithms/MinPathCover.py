import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Cobertura mínima por caminos disjuntos en un DAG (n − emparejamiento máximo)
 * Problema  : Luogu P2764 - 最小路径覆盖问题 (https://www.luogu.com.cn/problem/P2764)
 * Entrada   : n m; m arcos "a b" de un DAG (1-indexado)
 * Salida    : cada camino en una línea (sus vértices en orden) y al final la cantidad mínima de caminos
 * Complejidad: tiempo O(n · m) con Kuhn, memoria O(n + m)
"""


def main():
    data = sys.stdin.buffer.read().split()
    n, m = int(data[0]), int(data[1])
    g = [[] for _ in range(n + 1)]
    for i in range(m):
        g[int(data[2 + 2 * i])].append(int(data[3 + 2 * i]))
    matchR = [0] * (n + 1)
    matchL = [0] * (n + 1)
    vis = [0] * (n + 1)
    M = 0
    for s in range(1, n + 1):
        # Kuhn iterativo: buscar un camino aumentante desde s
        stamp = s
        st = [(s, iter(g[s]))]
        prev = {}
        found = 0
        while st and not found:
            u, it = st[-1]
            for v in it:
                if vis[v] == stamp:
                    continue
                vis[v] = stamp
                prev[v] = u
                if matchR[v] == 0:
                    found = v
                else:
                    st.append((matchR[v], iter(g[matchR[v]])))
                break
            else:
                st.pop()
        if found:
            M += 1
            v = found
            while True:                   # invertir el camino aumentante
                u = prev[v]
                nxt = matchL[u]
                matchR[v], matchL[u] = u, v
                if u == s:
                    break
                v = nxt
    out = []
    for u in range(1, n + 1):
        if matchR[u]:
            continue
        path, x = [], u
        while x:
            path.append(x)
            x = matchL[x]
        out.append(" ".join(map(str, path)))
    out.append(str(n - M))
    print("\n".join(out))


main()
