import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Segment Tree Beats (a_i = min(a_i, t) en rangos, con máximo y suma)
 * Problema  : HDU 5306 - Gorgeous Sequence (https://acm.hdu.edu.cn/showproblem.php?pid=5306)
 * Entrada   : T casos; cada uno n m, el arreglo y m operaciones "0 x y t" (chmin), "1 x y" (máximo), "2 x y" (suma)
 * Salida    : la respuesta de cada operación 1 y 2
 * Complejidad: tiempo O((n + m) log n) amortizado, memoria O(n)
"""


def main():
    data = sys.stdin.buffer.read().split()
    T = int(data[0])
    p = 1
    out = []
    for _ in range(T):
        n, m = int(data[p]), int(data[p + 1])
        p += 2
        a = [0] + [int(x) for x in data[p:p + n]]
        p += n
        size = 4 * n
        mx1 = [0] * size
        mx2 = [-1] * size
        cmx = [0] * size
        sm = [0] * size

        def pull(u):
            l, r = 2 * u, 2 * u + 1
            sm[u] = sm[l] + sm[r]
            if mx1[l] == mx1[r]:
                mx1[u], cmx[u], mx2[u] = mx1[l], cmx[l] + cmx[r], max(mx2[l], mx2[r])
            elif mx1[l] > mx1[r]:
                mx1[u], cmx[u], mx2[u] = mx1[l], cmx[l], max(mx2[l], mx1[r])
            else:
                mx1[u], cmx[u], mx2[u] = mx1[r], cmx[r], max(mx1[l], mx2[r])

        def aplicar(u, t):
            if mx1[u] > t:
                sm[u] -= (mx1[u] - t) * cmx[u]
                mx1[u] = t

        # construcción iterativa (postorden)
        st = [(1, 1, n, False)]
        while st:
            u, l, r, listo = st.pop()
            if l == r:
                mx1[u] = sm[u] = a[l]
                mx2[u] = -1
                cmx[u] = 1
            elif listo:
                pull(u)
            else:
                mid = (l + r) // 2
                st.append((u, l, r, True))
                st.append((2 * u + 1, mid + 1, r, False))
                st.append((2 * u, l, mid, False))

        def chmin(u, l, r, x, y, t):      # recursivo: la profundidad es O(log n)
            if y < l or r < x or mx1[u] <= t:
                return
            if x <= l and r <= y and mx2[u] < t:
                aplicar(u, t)
                return
            aplicar(2 * u, mx1[u])
            aplicar(2 * u + 1, mx1[u])
            mid = (l + r) // 2
            chmin(2 * u, l, mid, x, y, t)
            chmin(2 * u + 1, mid + 1, r, x, y, t)
            pull(u)

        def query(u, l, r, x, y, tipo):
            if y < l or r < x:
                return -1 if tipo == 1 else 0
            if x <= l and r <= y:
                return mx1[u] if tipo == 1 else sm[u]
            aplicar(2 * u, mx1[u])
            aplicar(2 * u + 1, mx1[u])
            mid = (l + r) // 2
            A = query(2 * u, l, mid, x, y, tipo)
            B = query(2 * u + 1, mid + 1, r, x, y, tipo)
            return max(A, B) if tipo == 1 else A + B

        for _ in range(m):
            op, x, y = int(data[p]), int(data[p + 1]), int(data[p + 2])
            p += 3
            if op == 0:
                chmin(1, 1, n, x, y, int(data[p]))
                p += 1
            else:
                out.append(query(1, 1, n, x, y, op))
    sys.stdout.write("\n".join(map(str, out)) + "\n")


main()
