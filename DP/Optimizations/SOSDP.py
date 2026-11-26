import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : DP sobre subconjuntos (SOS: suma sobre subconjuntos y superconjuntos)
 * Problema  : CSES 1654 - Bit Problem (https://cses.fi/problemset/task/1654)
 * Entrada   : n; los números x_1 … x_n (0 ≤ x_i < 2^20)
 * Salida    : por cada x: cuántos y cumplen x | y = x, cuántos x & y = x y cuántos x & y ≠ 0
 * Complejidad: tiempo O(B · 2^B + n) con B = 20, memoria O(2^B)
"""


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    x = list(map(int, data[1:1 + n]))
    B = max(max(x).bit_length(), 1)        # basta con los bits que de verdad aparecen
    size = 1 << B
    sub = [0] * size
    for v in x:
        sub[v] += 1
    sup = sub[:]
    for b in range(B):
        bit = 1 << b
        for m in range(size):
            if m & bit:
                sub[m] += sub[m ^ bit]     # y ⊆ m con el bit b apagado
                sup[m ^ bit] += sup[m]     # y ⊇ m con el bit b prendido
    full = size - 1
    sys.stdout.write("\n".join(f"{sub[v]} {sup[v]} {n - sub[full ^ v]}" for v in x) + "\n")


main()
