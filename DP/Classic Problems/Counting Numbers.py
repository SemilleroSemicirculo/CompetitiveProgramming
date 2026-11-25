import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : DP de dígitos (contar números con una propiedad hasta un límite)
 * Problema  : CSES 2220 - Counting Numbers (https://cses.fi/problemset/task/2220)
 * Entrada   : dos enteros a y b
 * Salida    : cantidad de enteros en [a, b] sin dos dígitos vecinos iguales
 * Complejidad: tiempo O(10 · dígitos), memoria O(dígitos)
"""


def contar(x):
    """Cuenta los enteros en [0, x] sin dos dígitos vecinos iguales."""
    if x < 0:
        return 0
    if x == 0:
        return 1
    s = str(x)
    n = len(s)
    res = 1  # el número 0
    # números con menos dígitos: primer dígito 1..9 y cada siguiente distinto al anterior
    for length in range(1, n):
        res += 9 ** length
    # números con n dígitos menores que x: prefijo igual a x y en la posición i un dígito menor
    for i in range(n):
        for d in range(1 if i == 0 else 0, int(s[i])):
            if i == 0 or d != int(s[i - 1]):
                res += 9 ** (n - 1 - i)
        # si x tiene dos dígitos vecinos iguales, ningún número con este prefijo sirve
        if i > 0 and s[i] == s[i - 1]:
            return res
    return res + 1  # x mismo es válido


def main():
    a, b = map(int, input().split())
    print(contar(b) - contar(a - 1))


main()
