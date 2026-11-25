import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : DP de probabilidades sobre subconjuntos (bitmask)
 * Problema  : Codeforces 16E - Fish (https://codeforces.com/problemset/problem/16/E)
 * Entrada   : n, luego la matriz a (a[i][j] = probabilidad de que i se coma a j)
 * Salida    : para cada pez, la probabilidad de ser el último
 * Complejidad: tiempo O(2^n · n^2), memoria O(2^n)
"""


def main():
    data = sys.stdin.read().split()
    n = int(data[0])
    a = [list(map(float, data[1 + i * n:1 + (i + 1) * n])) for i in range(n)]
    full = (1 << n) - 1
    # P[mask] = probabilidad de que en algún momento queden vivos exactamente los de mask
    P = [0.0] * (1 << n)
    P[full] = 1.0
    for mask in range(full, 0, -1):
        pm = P[mask]
        if not pm:
            continue
        alive = [i for i in range(n) if mask >> i & 1]
        k = len(alive)
        if k < 2:
            continue
        share = pm / (k * (k - 1) / 2)  # cada par se encuentra con la misma probabilidad
        for j in alive:
            # j muere si se encuentra con algún i vivo y este se lo come
            s = 0.0
            for i in alive:
                s += a[i][j]
            P[mask ^ (1 << j)] += share * s
    print(' '.join(f"{P[1 << i]:.9f}" for i in range(n)))


main()
