import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Código de Gray (i ^ (i >> 1))
 * Problema  : CSES 2205 - Gray Code (https://cses.fi/problemset/task/2205)
 * Entrada   : n
 * Salida    : los 2^n códigos de Gray de n bits, uno por línea
 * Complejidad: tiempo O(2^n · n), memoria O(n)
"""


def main():
    n = int(input())
    out = []
    # hay 2^n códigos
    for i in range(1 << n):
        # código Gray del número i: i XOR (i >> 1), escrito con n bits
        out.append(format(i ^ (i >> 1), "0%db" % n))
    print("\n".join(out))


main()
