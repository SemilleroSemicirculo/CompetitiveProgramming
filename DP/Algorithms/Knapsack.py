import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Mochila 0/1 (DP unidimensional)
 * Problema  : CSES 1158 - Book Shop (https://cses.fi/problemset/task/1158)
 * Entrada   : n x, luego n precios y luego n cantidades de páginas
 * Salida    : máximo de páginas que se pueden comprar con presupuesto x
 * Complejidad: tiempo O(n·x), memoria O(x)
"""
def main():
    n, x = map(int, input().split())
    price = list(map(int, input().split()))
    pages = list(map(int, input().split()))

    # dp[w] = máximo de páginas con presupuesto w
    dp = [0] * (x + 1)
    # cada libro se usa una sola vez (mochila 0/1)
    for i in range(n):
        p, v = price[i], pages[i]
        # el presupuesto se recorre de mayor a menor para no reusar el mismo libro
        for w in range(x, p - 1, -1):
            # o no se compra el libro i, o se compra y se suma sus páginas
            if dp[w - p] + v > dp[w]:
                dp[w] = dp[w - p] + v
    print(dp[x])


main()
