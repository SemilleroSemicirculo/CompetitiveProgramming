import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Pila monótona (menor valor anterior)
 * Problema  : CSES 1645 - Nearest Smaller Values (https://cses.fi/problemset/task/1645)
 * Entrada   : n, luego n enteros
 * Salida    : para cada posición, el índice (base 1) del elemento menor más cercano a la izquierda, o 0
 * Complejidad: tiempo O(n), memoria O(n)
"""


def main():
    n = int(input())
    a = list(map(int, input().split()))

    # se mantienen los candidatos a "menor más cercano"
    st = []
    res = []
    for i in range(n):
        # los mayores o iguales a a[i] ya no sirven para elementos futuros
        while st and a[st[-1]] >= a[i]:
            st.pop()
        # el tope es el menor más cercano a la izquierda (o 0 si no hay)
        res.append(st[-1] + 1 if st else 0)
        # a[i] es candidato para los siguientes
        st.append(i)
    print(*res)


main()
