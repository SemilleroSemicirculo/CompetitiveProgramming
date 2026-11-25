import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Li Chao Tree (máximo entre rectas en un punto)
 * Problema  : CSES 3429 - Lines and Queries I (https://cses.fi/problemset/task/3429)
 * Entrada   : n, luego n consultas "1 a b" (agregar la recta ax + b) o "2 x" (máximo en x)
 * Salida    : la respuesta de cada consulta de tipo 2
 * Complejidad: tiempo O(n log X) con X = 10^5, memoria O(X)
"""


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    X = 1 << 17  # potencia de 2 mayor que 10^5 + 1: el árbol cubre x en [0, X)
    # A[v], B[v] = recta del nodo v (None = vacío); gana en el centro del tramo del nodo
    A = [0] * (2 * X)
    B = [None] * (2 * X)
    out = []
    pos = 1
    for _ in range(n):
        if data[pos] == b'1':
            a, b = int(data[pos + 1]), int(data[pos + 2])
            pos += 3
            v, l, r = 1, 0, X - 1
            while True:
                if B[v] is None:
                    A[v], B[v] = a, b
                    break
                m = (l + r) >> 1
                ca, cb = A[v], B[v]
                win_l = a * l + b > ca * l + cb
                win_m = a * m + b > ca * m + cb
                if win_m:  # el nodo se queda con la mejor en el centro
                    A[v], B[v], a, b = a, b, ca, cb
                if l == r:
                    break
                # la perdedora solo puede ganar en una de las dos mitades
                if win_l != win_m:
                    v, r = 2 * v, m
                else:
                    v, l = 2 * v + 1, m + 1
        else:
            x = int(data[pos + 1])
            pos += 2
            # el máximo está en algún nodo del camino de la raíz a la hoja x
            v = x + X
            best = -INF
            while v:
                if B[v] is not None:
                    y = A[v] * x + B[v]
                    if y > best:
                        best = y
                v >>= 1
            out.append(best)
    print('\n'.join(map(str, out)))


main()
