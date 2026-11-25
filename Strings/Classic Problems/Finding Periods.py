import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Función Z (periodos de una cadena)
 * Problema  : CSES 1733 - Finding Periods (https://cses.fi/problemset/task/1733)
 * Entrada   : una cadena de largo n
 * Salida    : todos los largos de periodo en orden creciente
 * Complejidad: tiempo O(n), memoria O(n)
"""


def main():
    s = sys.stdin.buffer.readline().strip()
    n = len(s)
    # z[i] = largo del mayor prefijo de s que empieza también en la posición i
    z = [0] * n
    l = r = 0
    for i in range(1, n):
        k = 0
        if i < r:
            k = min(r - i, z[i - l])  # se reutiliza lo ya comparado en [l, r)
        while i + k < n and s[k] == s[i + k]:
            k += 1
        z[i] = k
        if i + k > r:
            l, r = i, i + k
    # p es periodo si al correr la cadena p posiciones coincide con el prefijo hasta el final
    res = [p for p in range(1, n) if z[p] == n - p]
    res.append(n)  # toda la cadena siempre es un periodo
    print(*res)


main()
