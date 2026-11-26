import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Small to large (unir siempre el mapa chico en el grande: cada elemento se mueve O(log n) veces)
 * Problema  : Codeforces 600E - Lomsat gelral (https://codeforces.com/problemset/problem/600/E)
 * Entrada   : n; colores c_1 … c_n; n − 1 aristas (raíz 1)
 * Salida    : para cada nodo, la suma de los colores que más se repiten en su subárbol
 * Complejidad: tiempo O(n log n) operaciones de diccionario, memoria O(n)
"""


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    c = [0] + [int(x) for x in data[1:1 + n]]
    g = [[] for _ in range(n + 1)]
    p = 1 + n
    for _ in range(n - 1):
        a, b = int(data[p]), int(data[p + 1])
        p += 2
        g[a].append(b)
        g[b].append(a)
    par = [0] * (n + 1)
    par[1] = -1
    orden, st = [], [1]
    while st:
        u = st.pop()
        orden.append(u)
        for v in g[u]:
            if v != par[u]:
                par[v] = u
                st.append(v)
    mp = [None] * (n + 1)
    best = [0] * (n + 1)
    suma = [0] * (n + 1)
    res = [0] * (n + 1)
    for u in reversed(orden):
        d = {c[u]: 1}
        bu, su = 1, c[u]
        for v in g[u]:
            if v == par[u]:
                continue
            dv = mp[v]
            if len(dv) > len(d):          # el más grande se queda
                d, dv = dv, d
                bu, su, best[v], suma[v] = best[v], suma[v], bu, su
            for color, k in dv.items():
                f = d.get(color, 0) + k
                d[color] = f
                if f > bu:
                    bu, su = f, color
                elif f == bu:
                    su += color
            mp[v] = None
        mp[u] = d
        best[u], suma[u] = bu, su
        res[u] = su
    print(" ".join(map(str, res[1:])))


main()
