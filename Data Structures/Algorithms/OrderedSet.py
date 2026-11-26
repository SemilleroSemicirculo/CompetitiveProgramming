import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Conjunto ordenado con k-ésimo elemento (en Python: Fenwick con descenso binario)
 * Problema  : CSES 2163 - Josephus Problem II (https://cses.fi/problemset/task/2163)
 * Entrada   : n, k: n niños en círculo; se salta k niños y se saca el siguiente, repetidamente
 * Salida    : el orden en que salen los niños
 * Complejidad: tiempo O(n log n), memoria O(n)
"""


def main():
    n, k = map(int, input().split())
    # Fenwick con un 1 por niño presente; buscar el i-ésimo presente bajando por potencias de 2
    bit = [0] * (n + 1)
    for i in range(1, n + 1):
        bit[i] += 1
        j = i + (i & -i)
        if j <= n:
            bit[j] += bit[i]
    LOG = 1 << n.bit_length()
    res = []
    pos, vivos = 0, n
    while vivos:
        pos = (pos + k) % vivos
        # el (pos+1)-ésimo presente: mayor prefijo con suma ≤ pos, más uno
        idx, resto, paso = 0, pos, LOG
        while paso:
            nxt = idx + paso
            if nxt <= n and bit[nxt] <= resto:
                idx = nxt
                resto -= bit[nxt]
            paso >>= 1
        idx += 1
        res.append(idx)
        while idx <= n:                   # quitar al niño
            bit[idx] -= 1
            idx += idx & -idx
        vivos -= 1
    print(" ".join(map(str, res)))


main()
