import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Fenwick Tree sobre el arreglo de diferencias (suma en rango, consulta puntual)
 * Problema  : CSES 1651 - Range Update Queries (https://cses.fi/problemset/task/1651)
 * Entrada   : n q, n enteros, luego q consultas "1 a b u" (sumar u a [a, b]) o "2 k" (valor en k)
 * Salida    : el valor pedido en cada consulta de tipo 2
 * Complejidad: tiempo O((n + q) log n), memoria O(n)
"""


def main():
    data = sys.stdin.buffer.read().split()
    n, q = int(data[0]), int(data[1])
    x = [0] + list(map(int, data[2:2 + n]))
    # bit guarda diferencias: sumar u a [a, b] es +u en a y -u en b+1
    bit = [0] * (n + 1)
    pos = 2 + n
    out = []
    for _ in range(q):
        if data[pos] == b'1':
            a, b, u = int(data[pos + 1]), int(data[pos + 2]), int(data[pos + 3])
            pos += 4
            i = a
            while i <= n:
                bit[i] += u
                i += i & -i
            i = b + 1
            while i <= n:
                bit[i] -= u
                i += i & -i
        else:
            k = int(data[pos + 1])
            pos += 2
            # el valor actual es el original más todo lo acumulado hasta k
            s = x[k]
            while k > 0:
                s += bit[k]
                k -= k & -k
            out.append(s)
    print('\n'.join(map(str, out)))


main()
