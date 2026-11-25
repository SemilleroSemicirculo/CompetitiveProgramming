import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Cadena de Markov (distribución tras k pasos) + linealidad de la esperanza
 * Problema  : CSES 1726 - Moving Robots (https://cses.fi/problemset/task/1726)
 * Entrada   : k
 * Salida    : número esperado de casillas vacías de un tablero 8×8 tras k pasos, con seis decimales
 * Complejidad: tiempo O(64 · k · 64), memoria O(64 · 64)
"""


def main():
    k = int(input())
    # vecinos de cada casilla (el robot elige al azar entre los que no lo sacan del tablero)
    nb = []
    for c in range(64):
        x, y = divmod(c, 8)
        nb.append([a * 8 + b for a, b in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)) if 0 <= a < 8 and 0 <= b < 8])
    vacia = [1.0] * 64
    for start in range(64):
        # p[c] = probabilidad de que el robot que salió de start esté en c
        p = [0.0] * 64
        p[start] = 1.0
        for _ in range(k):
            q = [0.0] * 64
            for c in range(64):
                if p[c]:
                    share = p[c] / len(nb[c])
                    for v in nb[c]:
                        q[v] += share
            p = q
        # los robots son independientes: P(c vacía) = Π (1 - P(robot en c))
        for c in range(64):
            vacia[c] *= 1 - p[c]
    # linealidad de la esperanza: E[vacías] = Σ P(casilla vacía)
    print(f"{sum(vacia):.6f}")


main()
