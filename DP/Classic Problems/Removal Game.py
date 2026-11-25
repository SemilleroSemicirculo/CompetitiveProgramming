import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : DP de intervalos (juego de dos jugadores, minimax)
 * Problema  : CSES 1097 - Removal Game (https://cses.fi/problemset/task/1097)
 * Entrada   : n, luego n enteros
 * Salida    : puntaje máximo del primer jugador si ambos juegan óptimamente
 * Complejidad: tiempo O(n^2), memoria O(n)
"""


def main():
    n = int(input())
    x = list(map(int, input().split()))
    # d[l] = (mi puntaje - puntaje del rival) jugando primero en un tramo que empieza en l
    d = x[:]  # tramos de largo 1
    for length in range(2, n + 1):
        # tomo x[l] y el rival juega en [l+1, r], o tomo x[r] y el rival juega en [l, r-1]
        d = [max(a - b, c - e) for a, b, c, e in zip(x, d[1:], x[length - 1:], d)]
    # mío + rival = total y mío - rival = d[0]
    print((sum(x) + d[0]) // 2)


main()
