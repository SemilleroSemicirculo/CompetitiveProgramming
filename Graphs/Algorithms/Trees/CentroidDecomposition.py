import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Descomposición por centroides (caminos de longitud fija)
 * Problema  : CSES 2080 - Fixed-Length Paths I (https://cses.fi/problemset/task/2080)
 * Entrada   : n k, luego n-1 aristas "a b"
 * Salida    : cantidad de caminos con exactamente k aristas
 * Complejidad: tiempo O(n log n), memoria O(n)
"""


def main():
    data = sys.stdin.buffer.read().split()
    n, k = int(data[0]), int(data[1])
    G = [[] for _ in range(n + 1)]
    for i in range(n - 1):
        a, b = int(data[2 + 2 * i]), int(data[3 + 2 * i])
        G[a].append(b)
        G[b].append(a)

    removed = [False] * (n + 1)
    sz = [0] * (n + 1)
    par = [0] * (n + 1)
    dep = [0] * (n + 1)
    # cnt[d] = nodos a profundidad d ya vistos alrededor del centroide actual
    cnt = [0] * (n + 2)
    answer = 0

    # 1) se halla el centroide, 2) se cuentan los caminos que pasan por él, 3) se repite en cada parte
    stack = [1]
    while stack:
        root = stack.pop()
        # tamaño de cada subárbol (ignorando centroides ya removidos)
        par[root] = 0
        order = [root]
        for u in order:
            for v in G[u]:
                if v != par[u] and not removed[v]:
                    par[v] = u
                    order.append(v)
        for u in reversed(order):
            sz[u] = 1
        for u in reversed(order):
            if u != root:
                sz[par[u]] += sz[u]
        total = len(order)
        # baja hacia el hijo con más de la mitad de los nodos
        c = root
        while True:
            nxt = 0
            for v in G[c]:
                if v != par[c] and not removed[v] and sz[v] * 2 > total:
                    nxt = v
                    break
            if nxt == 0:
                break
            c = nxt
        removed[c] = True

        cnt[0] = 1
        maxd = 0
        for v in G[c]:
            if removed[v]:
                continue
            # profundidades del subárbol de v (BFS desde v, sin pasar de k)
            par[v] = c
            dep[v] = 1
            q = [v]
            for u in q:
                du = dep[u]
                if du == k:
                    continue
                for w in G[u]:
                    if w != par[u] and not removed[w]:
                        par[w] = u
                        dep[w] = du + 1
                        q.append(w)
            # primero se consulta contra los subárboles anteriores, luego se agrega este
            for u in q:
                answer += cnt[k - dep[u]]
            for u in q:
                cnt[dep[u]] += 1
            if dep[q[-1]] > maxd:
                maxd = dep[q[-1]]
        # se limpia cnt para el siguiente centroide
        for d in range(1, maxd + 1):
            cnt[d] = 0

        for v in G[c]:
            if not removed[v]:
                stack.append(v)
    print(answer)


main()
