import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Búsqueda binaria paralela (todas las búsquedas avanzan juntas sobre la misma simulación)
 * Problema  : SPOJ METEORS - Meteors (https://www.spoj.com/problems/METEORS/)
 * Entrada   : N M; dueño o_1 … o_M de cada sector (en círculo); metas p_1 … p_N; K; K lluvias "l r a"
 *             (los sectores de l a r, dando la vuelta si l > r, reciben a cada uno)
 * Salida    : para cada estado, la primera lluvia tras la cual junta al menos p_i, o NIE
 * Complejidad: tiempo O((M + K) log M log K), memoria O(N + M + K)
"""


def main():
    data = sys.stdin.buffer.read().split()
    N, M = int(data[0]), int(data[1])
    sect = [[] for _ in range(N + 1)]
    for i in range(1, M + 1):
        sect[int(data[1 + i])].append(i)
    p = 2 + M
    meta = [0] + [int(x) for x in data[p:p + N]]
    p += N
    K = int(data[p]); p += 1
    rains = [(int(data[p + 3 * i]), int(data[p + 3 * i + 1]), int(data[p + 3 * i + 2])) for i in range(K)]
    lo = [1] * (N + 1)
    hi = [K + 1] * (N + 1)
    while True:
        en = [[] for _ in range(K + 2)]
        hay = False
        for s in range(1, N + 1):
            if lo[s] < hi[s]:
                en[(lo[s] + hi[s]) // 2].append(s)
                hay = True
        if not hay:
            break
        bit = [0] * (M + 2)

        def add(i, v):
            while i <= M:
                bit[i] += v
                i += i & -i

        for t in range(1, K + 1):
            l, r, a = rains[t - 1]
            add(l, a)
            if l <= r:
                add(r + 1, -a)
            else:
                add(1, a)
                add(r + 1, -a)
            for s in en[t]:
                total = 0
                for x in sect[s]:
                    i = x
                    while i > 0:
                        total += bit[i]
                        i -= i & -i
                    if total >= meta[s]:
                        break
                if total >= meta[s]:
                    hi[s] = t
                else:
                    lo[s] = t + 1
    print("\n".join("NIE" if lo[s] > K else str(lo[s]) for s in range(1, N + 1)))


main()
