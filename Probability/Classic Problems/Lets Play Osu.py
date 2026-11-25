import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Esperanza de un cuadrado con linealidad ((L+1)^2 − L^2 = 2L + 1)
 * Problema  : Codeforces 235B - Let's Play Osu! (https://codeforces.com/problemset/problem/235/B)
 * Entrada   : n, luego p_1 … p_n (probabilidad de acertar cada clic)
 * Salida    : puntaje esperado (suma de cuadrados de los bloques de aciertos), error ≤ 10^-6
 * Complejidad: tiempo O(n), memoria O(1)
"""


def main():
    data = sys.stdin.read().split()
    n = int(data[0])
    # length = E[largo del bloque de aciertos que termina en el clic actual]
    length = res = 0.0
    for p in map(float, data[1:1 + n]):
        res += p * (2 * length + 1)  # el puntaje sube (L+1)^2 − L^2 = 2L + 1 si acierta
        length = p * (length + 1)    # si falla, el bloque vuelve a 0
    print(f"{res:.12f}")


main()
