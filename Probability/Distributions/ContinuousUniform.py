import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Probabilidad continua uniforme (probabilidad geométrica: área favorable / área total)
 * Problema  : Sin problema equivalente en CSES; formato propio
 * Entrada   : a b s (x uniforme en [0, a], y uniforme en [0, b], independientes; reales positivos)
 * Salida    : P(x + y ≤ s) con nueve decimales
 * Complejidad: tiempo O(1), memoria O(1)
"""


def tri(c):
    """Área del triángulo {x + y ≤ c, x, y ≥ 0} (0 si c < 0)."""
    return c * c / 2 if c > 0 else 0.0


def main():
    a, b, s = map(float, input().split())
    # (x, y) es uniforme en el rectángulo [0, a] × [0, b]: P(evento) = área(evento) / (a · b).
    # Área de {x + y ≤ s} en el rectángulo por inclusión-exclusión de triángulos:
    area = tri(s) - tri(s - a) - tri(s - b) + tri(s - a - b)
    area = max(0.0, min(area, a * b))
    print(f"{area / (a * b):.9f}")


main()
