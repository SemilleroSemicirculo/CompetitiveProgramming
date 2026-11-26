import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Stoer-Wagner (corte mínimo global de un grafo no dirigido, sin fuente ni sumidero). Basado en KACTL (CC0)
 * Problema  : POJ 2914 - Minimum Cut (http://poj.org/problem?id=2914)
 * Entrada   : varios casos hasta fin de archivo; cada uno N M y M aristas "a b c" (0-indexadas, puede haber repetidas)
 * Salida    : para cada caso, el peso mínimo de aristas a quitar para desconectar el grafo
 * Complejidad: tiempo O(N³), memoria O(N²)
"""


def stoer_wagner(mat):
    n = len(mat)
    best = float("inf")
    vivos = list(range(n))
    while len(vivos) > 1:
        w = {v: 0 for v in vivos}
        fuera = set(vivos)
        s = t = -1
        while fuera:
            u = max(fuera, key=w.__getitem__)
            fuera.discard(u)
            s, t = t, u
            row = mat[u]
            for v in fuera:
                w[v] += row[v]
        best = min(best, w[t])
        for v in vivos:                    # fusionar t en s
            mat[s][v] += mat[t][v]
            mat[v][s] = mat[s][v]
        vivos.remove(t)
    return best


def main():
    data = sys.stdin.buffer.read().split()
    p, out = 0, []
    while p < len(data):
        n, m = int(data[p]), int(data[p + 1])
        p += 2
        mat = [[0] * n for _ in range(n)]
        for _ in range(m):
            a, b, c = int(data[p]), int(data[p + 1]), int(data[p + 2])
            p += 3
            if a != b:
                mat[a][b] += c
                mat[b][a] += c
        out.append(0 if n == 1 else stoer_wagner(mat))
    print("\n".join(map(str, out)))


main()
