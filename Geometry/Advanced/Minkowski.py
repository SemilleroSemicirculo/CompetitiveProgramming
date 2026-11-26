import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Suma de Minkowski de polígonos convexos (mezclar las aristas por ángulo) + punto en polígono convexo en O(log n)
 * Problema  : Codeforces 87E - Mogohu-Rea Idol (https://codeforces.com/problemset/problem/87/E)
 * Entrada   : tres polígonos convexos (cada uno: n y n vértices "x y" en sentido antihorario, sin tres colineales);
 *             m y m puntos "x y"
 * Salida    : para cada punto h, YES si existen a, b, c (uno en cada polígono, bordes incluidos) con a + b + c = 3h; si no, NO
 * Complejidad: tiempo O(n_1 + n_2 + n_3 + m log n), memoria O(n_1 + n_2 + n_3)
"""


def cross(ax, ay, bx, by):
    return ax * by - ay * bx


def normalizar(p):
    k = min(range(len(p)), key=lambda i: (p[i][1], p[i][0]))
    return p[k:] + p[:k]


def minkowski(a, b):
    a, b = normalizar(a), normalizar(b)
    n, m = len(a), len(b)
    a = a + a[:2]
    b = b + b[:2]
    res, i, j = [], 0, 0
    while i < n or j < m:
        res.append((a[i][0] + b[j][0], a[i][1] + b[j][1]))
        c = cross(a[i + 1][0] - a[i][0], a[i + 1][1] - a[i][1], b[j + 1][0] - b[j][0], b[j + 1][1] - b[j][1])
        if j >= m or (i < n and c > 0):
            i += 1
        elif i >= n or c < 0:
            j += 1
        else:
            i += 1
            j += 1
    return res


def main():
    data = sys.stdin.buffer.read().split()
    p = 0
    pol = []
    for _ in range(3):
        n = int(data[p]); p += 1
        pol.append([(int(data[p + 2 * i]), int(data[p + 2 * i + 1])) for i in range(n)])
        p += 2 * n
    s = minkowski(minkowski(pol[0], pol[1]), pol[2])
    k = len(s)
    t = [s[i] for i in range(k)
         if cross(s[i][0] - s[i - 1][0], s[i][1] - s[i - 1][1], s[(i + 1) % k][0] - s[i][0], s[(i + 1) % k][1] - s[i][1]) != 0]
    t = normalizar(t or s)
    n = len(t)
    x0, y0 = t[0]
    m = int(data[p]); p += 1
    out = []
    for _ in range(m):
        qx, qy = 3 * int(data[p]), 3 * int(data[p + 1])
        p += 2
        if n == 1:
            ok = (qx, qy) == t[0]
        elif n == 2:
            (ax, ay), (bx, by) = t
            ok = cross(bx - ax, by - ay, qx - ax, qy - ay) == 0 and min(ax, bx) <= qx <= max(ax, bx) and min(ay, by) <= qy <= max(ay, by)
        elif cross(t[1][0] - x0, t[1][1] - y0, qx - x0, qy - y0) < 0 or cross(t[-1][0] - x0, t[-1][1] - y0, qx - x0, qy - y0) > 0:
            ok = False
        else:
            lo, hi = 1, n - 1
            while hi - lo > 1:
                mid = (lo + hi) // 2
                if cross(t[mid][0] - x0, t[mid][1] - y0, qx - x0, qy - y0) >= 0:
                    lo = mid
                else:
                    hi = mid
            ok = cross(t[lo + 1][0] - t[lo][0], t[lo + 1][1] - t[lo][1], qx - t[lo][0], qy - t[lo][1]) >= 0
        out.append("YES" if ok else "NO")
    print("\n".join(out))


main()
