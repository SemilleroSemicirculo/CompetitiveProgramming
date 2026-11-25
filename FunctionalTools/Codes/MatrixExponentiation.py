import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Exponenciación de matrices (Fibonacci en O(log n))
 * Problema  : CSES 1722 - Fibonacci Numbers (https://cses.fi/problemset/task/1722)
 * Entrada   : n
 * Salida    : F(n) módulo 10^9+7
 * Complejidad: tiempo O(k^3 log n), k = 2, memoria O(k^2)
"""


MODM = 1000000007  # este problema pide módulo 10^9+7


# producto de matrices módulo MODM
def multiply(A, B):
    k = len(A)
    return [[sum(A[i][l] * B[l][j] for l in range(k)) % MODM for j in range(k)] for i in range(k)]


# exponenciación binaria: eleva la matriz en O(log e) multiplicaciones
def power(A, e):
    k = len(A)
    R = [[int(i == j) for j in range(k)] for i in range(k)]
    while e > 0:
        if e & 1:
            R = multiply(R, A)
        A = multiply(A, A)
        e >>= 1
    return R


def main():
    n = int(input())
    # matriz de Fibonacci: [F(n+1) F(n); F(n) F(n-1)] = [[1,1],[1,0]]^n
    M = [[1, 1], [1, 0]]
    print(power(M, n)[0][1])


main()
