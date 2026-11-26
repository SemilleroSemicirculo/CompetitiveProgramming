import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Teorema de Sprague-Grundy (números de Grundy con mex y suma de juegos con xor)
 * Problema  : Kattis - S-Nim (https://open.kattis.com/problems/snim)
 * Entrada   : k y los tamaños permitidos s_1 … s_k; m; luego m posiciones "l h_1 … h_l" (h ≤ 10^4)
 * Salida    : una línea con una letra por posición: W si gana quien mueve, L si pierde
 * Complejidad: tiempo O(H · k + Σ l), memoria O(H) con H = 10^4
"""


def main():
    data = sys.stdin.read().split()
    k = int(data[0])
    s = sorted(set(int(x) for x in data[1:1 + k]))
    pos = 1 + k
    H = 10000
    g = [0] * (H + 1)
    for h in range(1, H + 1):
        alcanzados = {g[h - x] for x in s if x <= h}
        v = 0
        while v in alcanzados:        # mex
            v += 1
        g[h] = v
    m = int(data[pos]); pos += 1
    res = []
    for _ in range(m):
        l = int(data[pos]); pos += 1
        x = 0
        for h in data[pos:pos + l]:
            x ^= g[int(h)]
        pos += l
        res.append("W" if x else "L")
    print("".join(res))


main()
