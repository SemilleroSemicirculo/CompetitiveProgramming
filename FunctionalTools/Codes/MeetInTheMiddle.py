import sys
from collections import Counter

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Meet in the middle (subconjuntos con suma x)
 * Problema  : CSES 1628 - Meet in the Middle (https://cses.fi/problemset/task/1628)
 * Entrada   : n x, luego n enteros
 * Salida    : cantidad de subconjuntos cuya suma es x
 * Complejidad: tiempo O(2^(n/2) · n), memoria O(2^(n/2))
"""


# genera las sumas de todos los subconjuntos duplicando la lista con cada elemento
def subset_sums(a):
    sums = [0]
    for v in a:
        sums += [s + v for s in sums]
    return sums


def main():
    n, x = map(int, input().split())
    a = list(map(int, input().split()))

    # se divide el arreglo en dos mitades
    L = subset_sums(a[:n // 2])
    R = subset_sums(a[n // 2:])
    # se cuenta cuántas veces aparece cada suma de la mitad derecha
    cnt = Counter(R)
    # para cada suma de la mitad izquierda se cuentan las de la derecha que completan x
    print(sum(cnt.get(x - s, 0) for s in L))


main()
