import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : DP de subconjuntos con bitset (sumas alcanzables)
 * Problema  : CSES 1745 - Money Sums (https://cses.fi/problemset/task/1745)
 * Entrada   : n, luego n valores de monedas
 * Salida    : cantidad de sumas distintas que se pueden formar y la lista ordenada
 * Complejidad: tiempo O(n · S / 64) con S = suma total, memoria O(S)
"""


def main():
    n = int(input())
    xs = list(map(int, input().split()))
    # un entero de Python funciona como bitset: bit s = la suma s se puede formar
    can = 1
    for x in xs:
        can |= can << x
    bits = bin(can)[:1:-1]  # bits[s] = '1' si la suma s es alcanzable
    res = [s for s in range(1, len(bits)) if bits[s] == '1']
    print(len(res))
    print(*res)


main()
