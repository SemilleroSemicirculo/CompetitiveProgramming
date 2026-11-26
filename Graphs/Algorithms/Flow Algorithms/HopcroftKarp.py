import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Hopcroft-Karp (emparejamiento bipartito máximo en O(E·√V))
 * Problema  : Library Checker - Matching on Bipartite Graph (https://judge.yosupo.jp/problem/bipartitematching)
 * Entrada   : L, R, M; luego M aristas a b (0 ≤ a < L, 0 ≤ b < R)
 * Salida    : el tamaño K del emparejamiento máximo y luego K parejas "a b"
 * Complejidad: tiempo O(E · √V), memoria O(V + E)
"""
from collections import deque


def main():
    data = sys.stdin.buffer.read().split()
    L, R, M = int(data[0]), int(data[1]), int(data[2])
    g = [[] for _ in range(L)]
    for i in range(M):
        g[int(data[3 + 2 * i])].append(int(data[4 + 2 * i]))
    mL = [-1] * L
    mR = [-1] * R
    K = 0
    while True:
        dist = [-1] * L
        q = deque()
        for a in range(L):
            if mL[a] == -1:
                dist[a] = 0
                q.append(a)
        hay = False
        while q:
            a = q.popleft()
            for b in g[a]:
                c = mR[b]
                if c == -1:
                    hay = True
                elif dist[c] == -1:
                    dist[c] = dist[a] + 1
                    q.append(c)
        if not hay:
            break
        it = [0] * L
        for s in range(L):
            if mL[s] != -1:
                continue
            # DFS iterativo por las capas; camino[] guarda los izquierdos visitados
            camino = [s]
            while camino:
                a = camino[-1]
                if it[a] == len(g[a]):
                    dist[a] = -1
                    camino.pop()
                    continue
                b = g[a][it[a]]
                c = mR[b]
                if c == -1:                       # aumentar a lo largo de camino
                    for x in reversed(camino):
                        bx = g[x][it[x]]
                        mL[x] = bx
                        mR[bx] = x
                    K += 1
                    break
                if dist[c] == dist[a] + 1:
                    camino.append(c)
                else:
                    it[a] += 1
            # al retroceder sin éxito, el padre debe probar su siguiente arista
            # (se maneja porque dist[a] = −1 hace fallar la condición de capa)
    out = [str(K)] + [f"{a} {mL[a]}" for a in range(L) if mL[a] != -1]
    print("\n".join(out))


main()
