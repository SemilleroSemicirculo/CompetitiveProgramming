import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Emparejamiento máximo en grafos generales (algoritmo de Edmonds con contracción de flores)
 * Problema  : Library Checker - Matching on General Graph (https://judge.yosupo.jp/problem/general_matching)
 * Entrada   : N M; M aristas "u v" (0-indexadas)
 * Salida    : K, el tamaño del emparejamiento máximo, y K líneas "u v" con sus aristas
 * Complejidad: tiempo O(N³), memoria O(N + M)
"""


def main():
    data = sys.stdin.buffer.read().split()
    n, m = int(data[0]), int(data[1])
    g = [[] for _ in range(n)]
    for i in range(m):
        u, v = int(data[2 + 2 * i]), int(data[3 + 2 * i])
        if u != v:
            g[u].append(v)
            g[v].append(u)
    mate = [-1] * n
    for v in range(n):
        if mate[v] < 0:
            for u in g[v]:
                if mate[u] < 0:
                    mate[u], mate[v] = v, u
                    break

    def buscar(raiz):
        padre = [-1] * n
        base = list(range(n))
        par = [False] * n
        par[raiz] = True
        q = [raiz]

        def lca(a, b):
            marca = [False] * n
            while True:
                a = base[a]
                marca[a] = True
                if mate[a] < 0:
                    break
                a = padre[mate[a]]
            while True:
                b = base[b]
                if marca[b]:
                    return b
                b = padre[mate[b]]

        def marcar(v, b, hijo, en):
            while base[v] != b:
                en[base[v]] = en[base[mate[v]]] = True
                padre[v] = hijo
                hijo = mate[v]
                v = padre[mate[v]]

        qi = 0
        while qi < len(q):
            v = q[qi]
            qi += 1
            for u in g[v]:
                if base[v] == base[u] or mate[v] == u:
                    continue
                if u == raiz or (mate[u] >= 0 and padre[mate[u]] >= 0):
                    b = lca(v, u)
                    en = [False] * n
                    marcar(v, b, u, en)
                    marcar(u, b, v, en)
                    for i in range(n):
                        if en[base[i]]:
                            base[i] = b
                            if not par[i]:
                                par[i] = True
                                q.append(i)
                elif padre[u] < 0:
                    padre[u] = v
                    if mate[u] < 0:
                        while u >= 0:
                            pv = padre[u]
                            ppv = mate[pv]
                            mate[u], mate[pv] = pv, u
                            u = ppv
                        return
                    par[mate[u]] = True
                    q.append(mate[u])

    for v in range(n):
        if mate[v] < 0:
            buscar(v)
    res = [(v, mate[v]) for v in range(n) if mate[v] > v]
    print(len(res))
    print("\n".join(f"{a} {b}" for a, b in res))


main()
