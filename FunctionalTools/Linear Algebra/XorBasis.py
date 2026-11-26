import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Base lineal sobre GF(2) (base xor): eliminación de Gauss con bits
 * Problema  : SPOJ XMAX - XOR Maximization (https://www.spoj.com/problems/XMAX/)
 * Entrada   : N; luego N enteros a_i (0 ≤ a_i ≤ 10^18)
 * Salida    : el máximo xor que se puede obtener con algún subconjunto
 * Complejidad: tiempo O(N · B) con B = 60 bits, memoria O(B)
"""


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    base = [0] * 61                       # base[b] = vector con bit más alto b
    for t in data[1:1 + n]:
        x = int(t)
        while x:
            b = x.bit_length() - 1
            if not base[b]:
                base[b] = x
                break
            x ^= base[b]
    res = 0
    for b in range(60, -1, -1):
        if res ^ base[b] > res:
            res ^= base[b]
    print(res)


main()
