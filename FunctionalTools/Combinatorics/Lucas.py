import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Teorema de Lucas: C(n, k) módulo un primo pequeño p con n, k hasta 10^18
 * Problema  : Problema propio: T consultas de coeficientes binomiales módulo un primo
 * Entrada   : T; luego T líneas "n k p" (0 ≤ k ≤ n ≤ 10^18, p primo, p ≤ 10^5)
 * Salida    : C(n, k) mód p para cada consulta
 * Complejidad: tiempo O(p + log_p n) por consulta, memoria O(p)
"""


def main():
    out = []
    fact = {}
    for _ in range(int(input())):
        n, k, p = map(int, input().split())
        if p not in fact:                 # factoriales hasta p − 1, guardados por primo
            f = [1] * p
            for i in range(1, p):
                f[i] = f[i - 1] * i % p
            fact[p] = f
        f = fact[p]
        res = 1
        while (n or k) and res:           # dígitos en base p
            a, b = n % p, k % p
            res = 0 if b > a else res * f[a] * pow(f[b] * f[a - b] % p, p - 2, p) % p
            n //= p
            k //= p
        out.append(res)
    print("\n".join(map(str, out)))


main()
