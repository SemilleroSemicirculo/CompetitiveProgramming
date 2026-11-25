import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Distribución geométrica y coleccionista de cupones (E = n · H_n)
 * Problema  : Sin problema equivalente en CSES; formato propio
 * Entrada   : n t (n tipos de cupón igual de probables, t compras; n, t ≤ 1000)
 * Salida    : el número esperado de compras para tener los n tipos, y la probabilidad de tenerlos todos en ≤ t compras
 * Complejidad: tiempo O(n · t), memoria O(n)
"""


def main():
    n, t = map(int, input().split())
    # con c tipos vistos, el siguiente nuevo llega tras una geométrica de esperanza n/(n − c)
    E = sum(n / (n - c) for c in range(n))  # = n · H_n
    # d[c] = P(haber visto exactamente c tipos): con c/n se repite uno viejo, con (n − c)/n sale uno nuevo
    stay = [c / n for c in range(n + 1)]
    new = [(n - c + 1) / n for c in range(n + 1)]
    d = [1.0] + [0.0] * n
    for _ in range(t):
        d = [d[0] * stay[0]] + [d[c] * stay[c] + d[c - 1] * new[c] for c in range(1, n + 1)]
    print(f"{E:.9f}")
    print(f"{d[n]:.9f}")


main()
