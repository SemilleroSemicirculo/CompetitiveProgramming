import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Conectividad dinámica offline: divide y vencerás sobre el tiempo + DSU con deshacer
 * Problema  : CSES 2133 - Dynamic Connectivity (https://cses.fi/problemset/task/2133)
 * Entrada   : n m k; m aristas iniciales; k eventos "1 a b" (agregar arista) o "2 a b" (quitarla)
 * Salida    : la cantidad de componentes al inicio y después de cada evento
 * Complejidad: tiempo O((m + k) log k log n), memoria O(m + k)
"""


def main():
    data = sys.stdin.buffer.read().split()
    n, m, k = int(data[0]), int(data[1]), int(data[2])
    p = 3
    desde = {}
    for _ in range(m):
        a, b = sorted((int(data[p]), int(data[p + 1])))
        p += 2
        desde[(a, b)] = 0
    T = k + 1
    seg = [[] for _ in range(4 * T)]

    def agregar(a, b, e):                 # intervalo [a, b] en el árbol del tiempo, sin recursión
        st = [(1, 0, T - 1)]
        while st:
            u, l, r = st.pop()
            if b < l or r < a:
                continue
            if a <= l and r <= b:
                seg[u].append(e)
                continue
            mid = (l + r) // 2
            st.append((2 * u, l, mid))
            st.append((2 * u + 1, mid + 1, r))

    for t in range(1, k + 1):
        tipo = data[p]
        a, b = sorted((int(data[p + 1]), int(data[p + 2])))
        p += 3
        if tipo == b"1":
            desde[(a, b)] = t
        else:
            agregar(desde.pop((a, b)), t - 1, (a, b))
    for e, t in desde.items():
        agregar(t, T - 1, e)
    par = list(range(n + 1))
    sz = [1] * (n + 1)
    hist = []
    comps = n
    res = [0] * T
    # DFS iterativo: ("entrar", u, l, r) une; ("salir", marca) deshace
    st = [(0, 1, 0, T - 1)]
    while st:
        item = st.pop()
        if item[0] == 1:
            marca = item[1]
            while len(hist) > marca:
                bb, aa = hist.pop()
                par[bb] = bb
                sz[aa] -= sz[bb]
                comps += 1
            continue
        _, u, l, r = item
        st.append((1, len(hist)))
        for a, b in seg[u]:
            while par[a] != a:
                a = par[a]
            while par[b] != b:
                b = par[b]
            if a != b:
                if sz[a] < sz[b]:
                    a, b = b, a
                par[b] = a
                sz[a] += sz[b]
                comps -= 1
                hist.append((b, a))
        if l == r:
            res[l] = comps
        else:
            mid = (l + r) // 2
            st.append((0, 2 * u + 1, mid + 1, r))
            st.append((0, 2 * u, l, mid))
    print(" ".join(map(str, res)))


main()
