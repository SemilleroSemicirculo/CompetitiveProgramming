import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Binary Lifting (ancestro a distancia k)
 * Problema  : CSES 1750 - Planets Queries I (https://cses.fi/problemset/task/1750)
 * Entrada   : n q, luego t_1..t_n (destino de cada planeta) y q consultas "x k"
 * Salida    : el planeta al que se llega desde x tras k teletransportes
 * Complejidad: tiempo O((n + q) log k), memoria O(n log k)
"""


# 2^30 > 10^9, suficiente para k hasta 10^9
LOG = 30


def main():
    data = sys.stdin.buffer.read().split()
    n, q = int(data[0]), int(data[1])
    # up[j][v] = nodo al que se llega desde v tras 2^j pasos
    up = [[0] + [int(x) for x in data[2:n + 2]]]
    # cada nivel sale de duplicar el anterior
    for j in range(1, LOG):
        prev = up[-1]
        up.append([prev[prev[v]] for v in range(n + 1)])

    out = []
    pos = n + 2
    for _ in range(q):
        x, k = int(data[pos]), int(data[pos + 1])
        pos += 2
        # se descompone k en binario y se salta por cada bit encendido
        j = 0
        while k:
            if k & 1:
                x = up[j][x]
            k >>= 1
            j += 1
        out.append(x)
    print("\n".join(map(str, out)))


main()
