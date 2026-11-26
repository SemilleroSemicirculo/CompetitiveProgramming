import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Arborescencia de costo mínimo (Chu-Liu/Edmonds con montículos zurdos y DSU con deshacer). Basado en KACTL (CC0)
 * Problema  : Library Checker - Directed MST (https://judge.yosupo.jp/problem/directedmst)
 * Entrada   : N M S; M arcos "a b c" (0-indexados, costo c); S es la raíz (se garantiza que todos son alcanzables)
 * Salida    : el costo mínimo X y luego p_0 … p_{N−1}, el padre de cada vértice (p_S = S)
 * Complejidad: tiempo O(M log M), memoria O(N + M)
"""


def main():
    data = sys.stdin.buffer.read().split()
    n, m, r = int(data[0]), int(data[1]), int(data[2])
    A = [int(x) for x in data[3::3][:m]]
    B = [int(x) for x in data[4::3][:m]]
    W = [int(x) for x in data[5::3][:m]]
    # montículo zurdo en arreglos (nodo = índice del arco): la profundidad derecha es O(log m)
    L = [-1] * m
    R = [-1] * m
    rk = [1] * m
    dl = [0] * m

    def prop(x):
        if dl[x]:
            W[x] += dl[x]
            if L[x] >= 0:
                dl[L[x]] += dl[x]
            if R[x] >= 0:
                dl[R[x]] += dl[x]
            dl[x] = 0

    def merge(a, b):
        if a < 0:
            return b
        if b < 0:
            return a
        prop(a)
        prop(b)
        if W[a] > W[b]:
            a, b = b, a
        R[a] = merge(R[a], b)
        if L[a] < 0 or rk[L[a]] < rk[R[a]]:
            L[a], R[a] = R[a], L[a]
        rk[a] = (rk[R[a]] if R[a] >= 0 else 0) + 1
        return a

    uf = [-1] * n
    hist = []

    def find(x):
        while uf[x] >= 0:
            x = uf[x]
        return x

    def join(a, b):
        a, b = find(a), find(b)
        if a == b:
            return False
        if uf[a] > uf[b]:
            a, b = b, a
        hist.append((a, uf[a]))
        hist.append((b, uf[b]))
        uf[a] += uf[b]
        uf[b] = a
        return True

    def rollback(t):
        while len(hist) > t:
            x, v = hist.pop()
            uf[x] = v

    heap = [-1] * n
    for i in range(m):
        heap[B[i]] = merge(heap[B[i]], i)
    res = 0
    seen = [-1] * n
    seen[r] = r
    path = [0] * n
    Q = [0] * n                           # arcos elegidos (por índice)
    inn = [-1] * n
    cycs = []
    for s in range(n):
        u, qi = s, 0
        while seen[u] < 0:
            h = heap[u]
            prop(h)
            e, we = h, W[h]
            dl[h] -= we                   # baja todo el montículo en we (incluido e, que se saca)
            prop(h)
            heap[u] = merge(L[h], R[h])
            W[e] = we                     # el costo con que se eligió se usa al reconstruir
            Q[qi] = e
            path[qi] = u
            qi += 1
            seen[u] = s
            res += we
            u = find(A[e])
            if seen[u] == s:
                cyc = -1
                end, tm = qi, len(hist)
                while True:
                    qi -= 1
                    w = path[qi]
                    cyc = merge(cyc, heap[w])
                    if not join(u, w):
                        break
                u = find(u)
                heap[u] = cyc
                seen[u] = -1
                cycs.append((u, tm, Q[qi:end]))
        for i in range(qi):
            inn[find(B[Q[i]])] = Q[i]
    for u, tm, comp in reversed(cycs):
        rollback(tm)
        ie = inn[u]
        for e in comp:
            inn[find(B[e])] = e
        inn[find(B[ie])] = ie
    par = [A[inn[i]] if inn[i] >= 0 else -1 for i in range(n)]
    par[r] = r
    print(res)
    print(" ".join(map(str, par)))


main()
