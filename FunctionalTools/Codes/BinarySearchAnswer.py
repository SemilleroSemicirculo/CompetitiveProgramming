import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Búsqueda binaria sobre la respuesta
 * Problema  : CSES 1620 - Factory Machines (https://cses.fi/problemset/task/1620)
 * Entrada   : n t, luego n tiempos k_i (una máquina produce un producto cada k_i segundos)
 * Salida    : mínimo tiempo para producir t productos
 * Complejidad: tiempo O(n log(t · k_min)), memoria O(n)
"""


def main():
    n, t = map(int, input().split())
    k = list(map(int, input().split()))

    # cota superior: la máquina más rápida sola produce t productos en k_min * t
    lo, hi = 1, min(k) * t
    # la respuesta es monótona: si en "mid" alcanza, en más tiempo también
    while lo < hi:
        mid = (lo + hi) // 2
        # cada máquina produce mid // k_i productos
        made = 0
        for x in k:
            made += mid // x
            if made >= t:
                break
        # alcanza: se prueba con menos tiempo; si no, con más
        if made >= t:
            hi = mid
        else:
            lo = mid + 1
    print(lo)


main()
