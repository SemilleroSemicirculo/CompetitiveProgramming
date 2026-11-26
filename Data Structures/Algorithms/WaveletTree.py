import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Wavelet tree (k-ésimo menor y conteo de valores en un rango)
 * Problema  : Library Checker - Range Kth Smallest (https://judge.yosupo.jp/problem/range_kth_smallest)
 * Entrada   : N Q; a_0 … a_{N−1}; Q consultas "l r k" sobre [l, r) con k desde 0
 * Salida    : el k-ésimo menor (desde 0) de a_l … a_{r−1} para cada consulta
 * Complejidad: tiempo O((N + Q) log V) tras comprimir valores, memoria O(N log V)
"""


def main():
    data = sys.stdin.buffer.read().split()
    N, Q = int(data[0]), int(data[1])
    a = [int(x) for x in data[2:2 + N]]
    vals = sorted(set(a))
    pos = {v: i for i, v in enumerate(vals)}
    a = [pos[x] for x in a]
    # nodos en un arreglo: nodo u con rango de valores [lo, hi]; hijos 2u y 2u + 1
    V = len(vals)
    izq = {}
    st = [(1, 0, V - 1, a)]
    while st:
        u, lo, hi, seq = st.pop()
        if lo == hi or not seq:
            continue
        mid = (lo + hi) // 2
        pref = [0] * (len(seq) + 1)
        c = 0
        for i, x in enumerate(seq):
            if x <= mid:
                c += 1
            pref[i + 1] = c
        izq[u] = pref
        st.append((2 * u, lo, mid, [x for x in seq if x <= mid]))
        st.append((2 * u + 1, mid + 1, hi, [x for x in seq if x > mid]))
    out = []
    p = 2 + N
    for _ in range(Q):
        l, r, k = int(data[p]), int(data[p + 1]), int(data[p + 2])
        p += 3
        u, lo, hi = 1, 0, V - 1
        while lo != hi:
            pref = izq[u]
            mid = (lo + hi) // 2
            e = pref[r] - pref[l]
            if k < e:
                l, r = pref[l], pref[r]
                u, hi = 2 * u, mid
            else:
                k -= e
                l, r = l - pref[l], r - pref[r]
                u, lo = 2 * u + 1, mid + 1
        out.append(vals[lo])
    sys.stdout.write("\n".join(map(str, out)) + "\n")


main()
