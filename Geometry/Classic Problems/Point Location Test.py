import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Producto cruz (orientación de tres puntos)
 * Problema  : CSES 2189 - Point Location Test (https://cses.fi/problemset/task/2189)
 * Entrada   : t, luego t líneas "x1 y1 x2 y2 x3 y3"
 * Salida    : LEFT, RIGHT o TOUCH según dónde queda p3 respecto a la recta p1 -> p2
 * Complejidad: tiempo O(1) por caso, memoria O(1)
"""


def main():
    data = sys.stdin.buffer.read().split()
    t = int(data[0])
    v = list(map(int, data[1:1 + 6 * t]))
    out = []
    for k in range(0, 6 * t, 6):
        x1, y1, x2, y2, x3, y3 = v[k:k + 6]
        # cruz de (p2 - p1) con (p3 - p1): positivo = izquierda, negativo = derecha, 0 = sobre la recta
        cr = (x2 - x1) * (y3 - y1) - (y2 - y1) * (x3 - x1)
        out.append('LEFT' if cr > 0 else 'RIGHT' if cr < 0 else 'TOUCH')
    print('\n'.join(out))


main()
