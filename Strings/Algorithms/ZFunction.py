import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Z-function
 * Problema  : CSES 1753 - String Matching (https://cses.fi/problemset/task/1753)
 * Entrada   : dos líneas: el texto s y el patrón t
 * Salida    : número de apariciones de t en s
 * Complejidad: tiempo O(|s| + |t|), memoria O(|s| + |t|)
"""


# z[i] = longitud del prefijo común más largo entre s y s[i:]
def z_function(s):
    n = len(s)
    z = [0] * n
    l = r = 0
    for i in range(1, n):
        # dentro del intervalo [l, r) ya hay información reutilizable
        if i < r:
            z[i] = min(r - i, z[i - l])
        # se extiende comparando carácter a carácter
        while i + z[i] < n and s[z[i]] == s[i + z[i]]:
            z[i] += 1
        # se actualiza el intervalo más a la derecha
        if i + z[i] > r:
            l, r = i, i + z[i]
    return z


def main():
    s = input().strip()
    t = input().strip()
    combined = t + '#' + s
    z = z_function(combined)
    # coincidencia completa del patrón en esa posición
    print(sum(1 for i in range(len(t) + 1, len(combined)) if z[i] == len(t)))


main()
