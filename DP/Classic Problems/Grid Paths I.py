import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : DP en cuadrícula (caminos con obstáculos)
 * Problema  : CSES 1638 - Grid Paths I (https://cses.fi/problemset/task/1638)
 * Entrada   : n, luego n filas de n caracteres ('.' libre, '*' trampa)
 * Salida    : caminos de la esquina superior izquierda a la inferior derecha (solo derecha/abajo), módulo 10^9+7
 * Complejidad: tiempo O(n^2), memoria O(n)
"""

M = 10**9 + 7


def main():
    n = int(input())
    # se guarda solo la fila anterior: row[j] = caminos que llegan a (i, j)
    row = [0] * n
    for i in range(n):
        line = input().strip()
        left = 0
        for j in range(n):
            if line[j] == '*':
                left = 0                      # a una trampa no se llega
            elif i == 0 and j == 0:
                left = 1
            else:
                left = (left + row[j]) % M    # desde la izquierda + desde arriba
            row[j] = left
    print(row[n - 1])


main()
