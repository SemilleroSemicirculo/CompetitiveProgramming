import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Búsqueda ternaria (máximo de una función unimodal)
 * Problema  : Sin problema equivalente en CSES; formato propio
 * Entrada   : L R
 * Salida    : el máximo de f(x) = -(x-3)^2 + 10 en [L, R]
 * Complejidad: tiempo O(log(R-L)), memoria O(1)
"""


# se descarta un tercio del intervalo en cada paso
def ternary_search(l, r, f):
    while r - l > 3:
        m1 = l + (r - l) // 3
        m2 = r - (r - l) // 3
        if f(m1) < f(m2):
            l = m1
        else:
            r = m2
    # al quedar pocos valores se revisan uno por uno
    return max(f(i) for i in range(l, r + 1))


def main():
    L, R = map(int, sys.stdin.read().split()[:2])
    print(ternary_search(L, R, lambda x: -(x - 3) * (x - 3) + 10))


main()
