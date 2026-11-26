import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Ciclo de media mínima (algoritmo de Karp)
 * Problema  : UVa 11090 - Going in Cycle!! (https://onlinejudge.org/external/110/11090.pdf)
 * Entrada   : T; cada caso: n m y m arcos dirigidos "a b c" (1-indexados)
 * Salida    : "Case #i: X" con la menor media de peso de un ciclo (2 decimales) o "Case #i: No cycle found."
 * Complejidad: tiempo O(n · m), memoria O(n²)
"""
from fractions import Fraction


def main():
    data = sys.stdin.buffer.read().split()
    T = int(data[0])
    p = 1
    out = []
    for cs in range(1, T + 1):
        n, m = int(data[p]), int(data[p + 1])
        p += 2
        e = [(int(data[p + 3 * i]) - 1, int(data[p + 3 * i + 1]) - 1, int(data[p + 3 * i + 2])) for i in range(m)]
        p += 3 * m
        D = [[0] * n] + [[INF] * n for _ in range(n)]
        for k in range(1, n + 1):
            prev, cur = D[k - 1], D[k]
            for a, b, c in e:
                if prev[a] != INF and prev[a] + c < cur[b]:
                    cur[b] = prev[a] + c
        best = None
        for v in range(n):
            if D[n][v] == INF:
                continue
            worst = max(Fraction(D[n][v] - D[k][v], n - k) for k in range(n) if D[k][v] != INF)
            if best is None or worst < best:
                best = worst
        if best is None:
            out.append(f"Case #{cs}: No cycle found.")
        else:
            out.append(f"Case #{cs}: {float(best):.2f}")
    print("\n".join(out))


main()
