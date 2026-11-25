import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : DP sobre subconjuntos (bitmask)
 * Problema  : CSES 1653 - Elevator Rides (https://cses.fi/problemset/task/1653)
 * Entrada   : n x, luego n pesos
 * Salida    : mínimo de viajes del ascensor (capacidad x) para llevar a todos
 * Complejidad: tiempo O(2^n · n), memoria O(2^n)
"""
def main():
    n, x = map(int, input().split())
    w = list(map(int, input().split()))

    # dp[mask] = (viajes, peso en el último viaje) mínimo para llevar a las personas de mask
    full = 1 << n
    rides = [n + 1] * full
    last = [0] * full
    # se parte con un viaje vacío
    rides[0], last[0] = 1, 0
    for mask in range(1, full):
        br, bl = n + 1, 0
        # se prueba cuál fue la última persona en subir
        for i in range(n):
            if mask >> i & 1:
                p = mask ^ (1 << i)
                r, l = rides[p], last[p]
                # cabe en el viaje actual o hay que abrir otro
                if l + w[i] <= x:
                    l += w[i]
                else:
                    r += 1
                    l = w[i]
                if r < br or (r == br and l < bl):
                    br, bl = r, l
        rides[mask], last[mask] = br, bl
    print(rides[full - 1])


main()
