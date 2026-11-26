import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Probabilidades y esperanzas con ciclos: sistema lineal resuelto con eliminación de Gauss
 * Problema  : Codeforces 113D - Museum (https://codeforces.com/problemset/problem/113/D)
 * Entrada   : n, m, a, b; m pasillos; luego p_1 … p_n (probabilidad de quedarse en el cuarto i)
 * Salida    : para cada cuarto, la probabilidad de que los dos amigos se encuentren allí
 * Complejidad: tiempo O(n⁶) = O(V³) con V = n² estados, memoria O(n⁴)
"""


def main():
    data = sys.stdin.read().split()
    n, m, a, b = (int(x) for x in data[:4])
    a -= 1
    b -= 1
    g = [[] for _ in range(n)]
    for i in range(m):
        u, v = int(data[4 + 2 * i]) - 1, int(data[5 + 2 * i]) - 1
        g[u].append(v)
        g[v].append(u)
    p = [float(x) for x in data[4 + 2 * m:4 + 2 * m + n]]
    T = [[0.0] * n for _ in range(n)]
    for i in range(n):
        T[i][i] = p[i]
        for k in g[i]:
            T[i][k] = (1 - p[i]) / len(g[i])
    V = n * n
    A = [[0.0] * (V + 1) for _ in range(V)]
    for s in range(V):
        A[s][s] = 1.0
    A[a * n + b][V] = 1.0
    for i in range(n):
        for j in range(n):
            if i == j:
                continue
            col = i * n + j
            for k in range(n):
                if T[i][k] > 0:
                    for l in range(n):
                        if T[j][l] > 0:
                            A[k * n + l][col] -= T[i][k] * T[j][l]
    for c in range(V):
        piv = max(range(c, V), key=lambda r: abs(A[r][c]))
        A[c], A[piv] = A[piv], A[c]
        fila = A[c]
        inv = 1.0 / fila[c]
        for r in range(V):
            if r != c and A[r][c] != 0.0:
                f = A[r][c] * inv
                Ar = A[r]
                for k in range(c, V + 1):
                    Ar[k] -= f * fila[k]
    print(" ".join(f"{A[k * n + k][V] / A[k * n + k][k * n + k]:.10f}" for k in range(n)))


main()
