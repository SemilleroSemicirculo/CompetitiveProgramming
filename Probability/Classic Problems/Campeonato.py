import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : DP de probabilidades (serie al primero en llegar a n victorias)
 * Problema  : Clásico "Campeonato"/World Series, sin problema equivalente en CSES
 * Entrada   : n p: victorias que necesita cada equipo y probabilidad p de que gane el equipo A un partido
 * Salida    : probabilidad de que A gane la serie (10 decimales)
 * Complejidad: tiempo O(n^2), memoria O(n^2)
"""
def main():
    n, p = input().split()
    n, p = int(n), float(p)
    # q = probabilidad de que gane B
    q = 1 - p

    # P[i][j] = probabilidad de que A gane si le faltan i victorias y a B le faltan j
    P = [[0.0] * (n + 1) for _ in range(n + 1)]
    # casos base: si A ya ganó la serie la probabilidad es 1 (si B ya ganó, es 0)
    for i in range(1, n + 1):
        P[0][i] = 1.0
    for i in range(1, n + 1):
        for j in range(1, n + 1):
            # se juega un partido: gana A (falta una victoria menos) o gana B
            P[i][j] = p * P[i - 1][j] + q * P[i][j - 1]

    print(f"{P[n][n]:.10f}")


main()
