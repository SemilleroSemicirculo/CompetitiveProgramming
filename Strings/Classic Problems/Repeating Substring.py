import sys
import random

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Búsqueda binaria sobre el largo + hashing polinomial (mayor subcadena que se repite)
 * Problema  : CSES 2106 - Repeating Substring (https://cses.fi/problemset/task/2106)
 * Entrada   : una cadena de largo n
 * Salida    : la subcadena más larga que aparece al menos dos veces, o -1
 * Complejidad: tiempo O(n log n), memoria O(n)
"""

P = (1 << 61) - 1  # primo grande: las colisiones son muy improbables


def main():
    s = sys.stdin.buffer.readline().strip()
    n = len(s)
    B = random.randrange(10**6, P - 1)  # base al azar para que nadie arme un caso malo
    # h[i] = hash del prefijo s[0..i), pw[i] = B^i
    h = [0] * (n + 1)
    pw = [1] * (n + 1)
    for i in range(n):
        h[i + 1] = (h[i] * B + s[i]) % P
        pw[i + 1] = pw[i] * B % P

    def repetida(L):
        """Devuelve el inicio de una subcadena de largo L que se repite, o -1."""
        p = pw[L]
        seen = {}
        for i in range(n - L + 1):
            x = (h[i + L] - h[i] * p) % P
            if x in seen:
                return i
            seen[x] = i
        return -1

    # si un largo L se repite, cualquier largo menor también: se busca el mayor con binaria
    lo, hi, at = 0, n - 1, -1
    while lo < hi:
        mid = (lo + hi + 1) // 2
        i = repetida(mid)
        if i >= 0:
            lo, at = mid, i
        else:
            hi = mid - 1
    print(s[at:at + lo].decode() if lo else -1)


main()
