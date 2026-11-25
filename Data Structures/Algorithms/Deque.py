import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Deque monótona (mínimo de ventana deslizante)
 * Problema  : CSES 3221 - Sliding Window Minimum (https://cses.fi/problemset/task/3221)
 * Entrada   : n k, luego x a b c con x_i = (a·x_{i-1} + b) mod c
 * Salida    : XOR de los mínimos de todas las ventanas de tamaño k
 * Complejidad: tiempo O(n), memoria O(n)
"""


def main():
    n, k = map(int, input().split())
    x, a, b, c = map(int, input().split())

    # la deque (lista + índice de frente) guarda índices con valores crecientes;
    # el frente es el mínimo de la ventana
    idx = [0] * n
    val = [0] * n
    head = tail = 0
    res = 0
    v = x
    for i in range(n):
        if i:
            v = (a * v + b) % c
        # se descartan los mayores o iguales a v: nunca serán mínimo
        while tail > head and val[tail - 1] >= v:
            tail -= 1
        idx[tail] = i
        val[tail] = v
        tail += 1
        # el frente salió de la ventana
        if idx[head] <= i - k:
            head += 1
        # la ventana ya tiene k elementos
        if i >= k - 1:
            res ^= val[head]
    print(res)


main()
