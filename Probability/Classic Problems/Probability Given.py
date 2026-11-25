import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Probabilidad condicional / teorema de Bayes con DP de conteo de éxitos
 * Problema  : UVa 11181 - Probability|Given
 * Entrada   : varios casos "N r" y N probabilidades p_i; termina con "0 0"
 * Salida    : "Case k:" y, para cada amigo, P(compró | exactamente r compraron), con seis decimales
 * Complejidad: tiempo O(N^3) por caso, memoria O(N)
"""


def conteo(p, saltar):
    """d[j] = P(exactamente j compran) entre todos menos el amigo saltar."""
    d = [1.0]
    for i, pi in enumerate(p):
        if i != saltar:
            d = [a * (1 - pi) + b * pi for a, b in zip(d + [0.0], [0.0] + d)]
    return d


def main():
    data = sys.stdin.read().split()
    pos, caso, out = 0, 0, []
    while pos + 1 < len(data):
        n, r = int(data[pos]), int(data[pos + 1])
        pos += 2
        if n == 0 and r == 0:
            break
        p = list(map(float, data[pos:pos + n]))
        pos += n
        caso += 1
        out.append(f"Case {caso}:")
        # Bayes: P(i compró | r compraron) = P(i compró y r compraron) / P(r compraron)
        total = conteo(p, -1)[r]
        for i in range(n):
            otros = conteo(p, i)
            conjunta = p[i] * otros[r - 1] if r else 0.0
            out.append(f"{conjunta / total:.6f}")
    print('\n'.join(out))


main()
