import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Función de Möbius e inversión (inclusión-exclusión sobre divisores)
 * Problema  : CSES 2417 - Counting Coprime Pairs (https://cses.fi/problemset/task/2417)
 * Entrada   : n; luego n enteros x_i (1 ≤ x_i ≤ 10^6)
 * Salida    : cuántos pares i < j cumplen gcd(x_i, x_j) = 1
 * Complejidad: tiempo O(V log V) con V = el máximo x_i, memoria O(V)
"""


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    xs = [int(x) for x in data[1:1 + n]]
    V = max(xs)
    cnt = [0] * (V + 1)
    for x in xs:
        cnt[x] += 1
    mu = [1] * (V + 1)
    primo = [True] * (V + 1)
    for p in range(2, V + 1):
        if primo[p]:
            for j in range(p, V + 1, p):
                if j > p:
                    primo[j] = False
                mu[j] = -mu[j]
            for j in range(p * p, V + 1, p * p):
                mu[j] = 0
    res = 0
    for d in range(1, V + 1):
        if mu[d]:
            m = sum(cnt[d::d])            # cuántos son múltiplos de d
            res += mu[d] * m * (m - 1) // 2
    print(res)


main()
