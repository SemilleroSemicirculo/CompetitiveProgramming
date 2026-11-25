import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Principio de inclusión-exclusión sobre subconjuntos
 * Problema  : CSES 2185 - Prime Multiples (https://cses.fi/problemset/task/2185)
 * Entrada   : n k, luego k primos distintos
 * Salida    : cuántos enteros de 1 a n son divisibles por al menos uno de los primos
 * Complejidad: tiempo O(número de subconjuntos con producto ≤ n), memoria igual
"""


def main():
    n, k = map(int, input().split())
    a = list(map(int, input().split()))
    # terms = [(producto, signo)] de los subconjuntos con producto ≤ n (los demás aportan 0)
    terms = [(1, -1)]  # el subconjunto vacío con signo -1 para que los de tamaño 1 queden en +1
    for p in a:
        terms += [(q * p, -s) for q, s in terms if q * p <= n]
    # |A1 ∪ ... ∪ Ak| = Σ (−1)^(|S|+1) · ⌊n / producto(S)⌋ sobre los S no vacíos
    print(sum(s * (n // q) for q, s in terms[1:]))


main()
