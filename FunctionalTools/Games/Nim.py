import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Juego de Nim (teorema de Bouton: gana quien empieza si el xor de las pilas no es 0)
 * Problema  : CSES 1730 - Nim Game I (https://cses.fi/problemset/task/1730)
 * Entrada   : t juegos; cada uno con n y luego las n pilas x_1 … x_n
 * Salida    : "first" si gana el primer jugador y "second" si no, por juego
 * Complejidad: tiempo O(n) por juego, memoria O(1)
"""


def main():
    out = []
    for _ in range(int(input())):
        input()
        x = 0
        for a in map(int, input().split()):
            x ^= a                 # suma de Nim
        out.append("first" if x else "second")
    print("\n".join(out))


main()
