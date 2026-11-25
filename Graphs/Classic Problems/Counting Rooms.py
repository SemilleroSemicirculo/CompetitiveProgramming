import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Componentes conexas en una cuadrícula (flood fill)
 * Problema  : CSES 1192 - Counting Rooms (https://cses.fi/problemset/task/1192)
 * Entrada   : n m, luego n filas de m caracteres ('.' piso, '#' pared)
 * Salida    : cantidad de cuartos (regiones de piso conectadas)
 * Complejidad: tiempo O(n · m), memoria O(n · m)
"""


def main():
    data = sys.stdin.buffer.read().split()
    n, m = int(data[0]), int(data[1])
    # cuadrícula aplanada con un borde de pared alrededor: así no hay que revisar límites
    W = m + 2
    free = bytearray(W * (n + 2))
    for i in range(n):
        row = data[2 + i]
        base = (i + 1) * W + 1
        free[base:base + m] = row.replace(b'.', b'\x01').replace(b'#', b'\x00')
    rooms = 0
    moves = (1, -1, W, -W)
    for start in range(W, W * (n + 1)):
        if not free[start]:
            continue
        # piso sin visitar: es un cuarto nuevo; se pinta entero con una pila
        rooms += 1
        free[start] = 0
        stack = [start]
        while stack:
            v = stack.pop()
            for d in moves:
                u = v + d
                if free[u]:
                    free[u] = 0
                    stack.append(u)
    print(rooms)


main()
