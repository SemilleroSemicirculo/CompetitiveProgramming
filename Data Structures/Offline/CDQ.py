import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Divide y vencerás de CDQ (dominancia en 3D: una dimensión por orden, otra por mezcla y otra con Fenwick)
 * Problema  : Luogu P3810 - 三维偏序 (https://www.luogu.com.cn/problem/P3810)
 * Entrada   : n k; luego n triples "a b c" (1 ≤ a, b, c ≤ k)
 * Salida    : para d = 0 … n − 1, cuántos puntos i tienen exactamente d puntos j ≠ i con a_j ≤ a_i, b_j ≤ b_i, c_j ≤ c_i
 * Complejidad: tiempo O(n log n log k), memoria O(n + k)
"""


def main():
    data = sys.stdin.buffer.read().split()
    n, K = int(data[0]), int(data[1])
    v = sorted(tuple(int(x) for x in data[2 + 3 * i:5 + 3 * i]) for i in range(n))
    pts = []                              # [a, b, c, cnt, ans]
    i = 0
    while i < n:
        j = i
        while j < n and v[j] == v[i]:
            j += 1
        pts.append([v[i][0], v[i][1], v[i][2], j - i, 0])
        i = j
    bit = [0] * (K + 1)

    def add(i, x):
        while i <= K:
            bit[i] += x
            i += i & -i

    def qry(i):
        s = 0
        while i > 0:
            s += bit[i]
            i -= i & -i
        return s

    # CDQ de abajo hacia arriba (sin recursión): bloques de tamaño 1, 2, 4, …
    N = len(pts)
    width = 1
    while width < N:
        for l in range(0, N, 2 * width):
            m, r = min(l + width, N), min(l + 2 * width, N)
            if m >= r:
                continue
            i, merged = l, []
            for j in range(m, r):
                while i < m and pts[i][1] <= pts[j][1]:
                    add(pts[i][2], pts[i][3])
                    merged.append(pts[i])
                    i += 1
                pts[j][4] += qry(pts[j][2])
                merged.append(pts[j])
            for t in range(l, i):
                add(pts[t][2], -pts[t][3])
            merged.extend(pts[i:m])
            pts[l:r] = merged
        width *= 2
    res = [0] * n
    for _, _, _, cnt, ans in pts:
        res[ans + cnt - 1] += cnt
    sys.stdout.write("\n".join(map(str, res)) + "\n")


main()
