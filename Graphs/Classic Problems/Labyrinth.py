import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : BFS en cuadrícula con reconstrucción del camino
 * Problema  : CSES 1193 - Labyrinth (https://cses.fi/problemset/task/1193)
 * Entrada   : n m, luego n filas con '.', '#', 'A' (inicio) y 'B' (fin)
 * Salida    : YES, el largo y las direcciones (L, R, U, D) de un camino más corto; o NO
 * Complejidad: tiempo O(n · m), memoria O(n · m)
"""


def main():
    data = sys.stdin.buffer.read().split()
    n, m = int(data[0]), int(data[1])
    # cuadrícula aplanada con un borde de pared alrededor
    W = m + 2
    grid = bytearray(b'#' * (W * (n + 2)))
    for i in range(n):
        base = (i + 1) * W + 1
        grid[base:base + m] = data[2 + i]
    s, e = grid.index(b'A'), grid.index(b'B')
    moves = ((-1, 'L'), (1, 'R'), (-W, 'U'), (W, 'D'))
    # frm[v] = índice de la dirección con la que se llegó a v (4 = inicio, 255 = sin visitar)
    frm = bytearray(b'\xff' * len(grid))
    frm[s] = 4
    q = [s]
    # BFS por niveles: la primera vez que se llega a una celda es por un camino más corto
    for v in q:
        if v == e:
            break
        for k in range(4):
            u = v + moves[k][0]
            if frm[u] == 255 and grid[u] != 35:  # 35 = '#'
                frm[u] = k
                q.append(u)
    if frm[e] == 255:
        print('NO')
        return
    # reconstruir desde B hacia A siguiendo las direcciones al revés
    path = []
    v = e
    while frm[v] != 4:
        d, c = moves[frm[v]]
        path.append(c)
        v -= d
    path.reverse()
    print('YES')
    print(len(path))
    print(''.join(path))


main()
