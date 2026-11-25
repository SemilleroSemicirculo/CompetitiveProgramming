import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : DP de probabilidades sobre el estado (blancos, negros)
 * Problema  : Codeforces 148D - Bag of mice (https://codeforces.com/problemset/problem/148/D)
 * Entrada   : w b (ratones blancos y negros)
 * Salida    : probabilidad de que gane la princesa (error ≤ 10^-9)
 * Complejidad: tiempo O(w · b), memoria O(w · b)
"""


def main():
    W, B = map(int, input().split())
    # P[w][b] = probabilidad de que gane la princesa si le toca sacar con w blancos y b negros
    P = [[0.0] * (B + 1) for _ in range(W + 1)]
    for w in range(1, W + 1):
        P[w][0] = 1.0  # solo blancos: gana de inmediato
        row, up = P[w], P[w - 1]
        for b in range(1, B + 1):
            t = w + b
            res = w / t  # saca blanco y gana
            if b >= 2:
                # princesa y dragón sacan negro; luego salta un ratón al azar
                both = b / t * (b - 1) / (t - 1)
                if t > 2:
                    res += both * w / (t - 2) * up[b - 2]
                if b >= 3:
                    res += both * (b - 2) / (t - 2) * row[b - 3]
            row[b] = res
    print(f"{P[W][B]:.9f}")


main()
