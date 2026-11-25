import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Dos punteros sobre arreglo ordenado (suma de dos valores)
 * Problema  : CSES 1640 - Sum of Two Values (https://cses.fi/problemset/task/1640)
 * Entrada   : n x, luego n enteros
 * Salida    : dos posiciones (base 1) cuyos valores suman x, o IMPOSSIBLE
 * Complejidad: tiempo O(n log n), memoria O(n)
"""


def main():
    n, x = map(int, input().split())
    # se guarda el índice original junto al valor
    a = sorted((v, i + 1) for i, v in enumerate(map(int, input().split())))

    # dos punteros en los extremos del arreglo ordenado
    l, r = 0, n - 1
    while l < r:
        s = a[l][0] + a[r][0]
        if s == x:
            print(a[l][1], a[r][1])
            return
        # suma pequeña: se sube el menor; suma grande: se baja el mayor
        if s < x:
            l += 1
        else:
            r -= 1
    print("IMPOSSIBLE")


main()
