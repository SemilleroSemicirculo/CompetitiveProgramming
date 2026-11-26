import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Lema de Burnside (contar objetos salvo simetrías: promedio de puntos fijos)
 * Problema  : CSES 2209 - Counting Necklaces (https://cses.fi/problemset/task/2209)
 * Entrada   : n m: collares de n perlas con m colores, iguales si uno es rotación del otro
 * Salida    : cuántos collares distintos hay, módulo 10^9 + 7
 * Complejidad: tiempo O(n log n), memoria O(n)
"""
from math import gcd

P = 10 ** 9 + 7


def main():
    n, m = map(int, input().split())
    pw = [1] * (n + 1)                    # m^g para cada g posible
    for g in range(1, n + 1):
        pw[g] = pw[g - 1] * m % P
    suma = sum(pw[gcd(i, n)] for i in range(n)) % P
    print(suma * pow(n, P - 2, P) % P)


main()
