import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Floyd-Warshall (distancias entre todos los pares)
 * Problema  : CSES 1672 - Shortest Routes II (https://cses.fi/problemset/task/1672)
 * Entrada   : n m q, luego m aristas no dirigidas "a b c" y q consultas "a b"
 * Salida    : la distancia mínima de cada consulta, o -1 si no hay camino
 * Complejidad: tiempo O(n^3 + q), memoria O(n^2)
"""


def main():
    data = sys.stdin.buffer.read().split()
    n, m, q = int(data[0]), int(data[1]), int(data[2])
    # BIG hace de infinito sin desbordar al sumar
    BIG = 10 ** 18
    dist = [[BIG] * n for _ in range(n)]
    for i in range(n):
        dist[i][i] = 0
    pos = 3
    for _ in range(m):
        a, b, c = int(data[pos]) - 1, int(data[pos + 1]) - 1, int(data[pos + 2])
        pos += 3
        if c < dist[a][b]:
            dist[a][b] = dist[b][a] = c

    # k = nodo intermedio permitido: se prueba pasar por k para cada par (i, j)
    for k in range(n):
        dk = dist[k]
        for i in range(n):
            di = dist[i]
            dik = di[k]
            if dik == BIG:
                continue
            # una fila completa a la vez: di[j] = min(di[j], dik + dk[j])
            dist[i] = [x if x < dik + y else dik + y for x, y in zip(di, dk)]

    out = []
    for _ in range(q):
        a, b = int(data[pos]) - 1, int(data[pos + 1]) - 1
        pos += 2
        out.append(-1 if dist[a][b] == BIG else dist[a][b])
    print("\n".join(map(str, out)))


main()
