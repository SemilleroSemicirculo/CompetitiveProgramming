import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Eliminación de Gauss-Jordan módulo un primo (sistemas de ecuaciones lineales)
 * Problema  : CSES 3154 - System of Linear Equations (https://cses.fi/problemset/task/3154)
 * Entrada   : n m (ecuaciones y variables); luego n filas con m coeficientes y el término b
 * Salida    : una solución x_1 … x_m módulo 10^9 + 7, o -1 si el sistema no tiene solución
 * Complejidad: tiempo O(n · m · min(n, m)), memoria O(n · m)
"""

P = 10 ** 9 + 7


def main():
    data = sys.stdin.buffer.read().split()
    n, m = int(data[0]), int(data[1])
    a = [[int(x) % P for x in data[2 + i * (m + 1):2 + (i + 1) * (m + 1)]] for i in range(n)]
    donde = [-1] * m
    fila = 0
    for col in range(m):
        if fila == n:
            break
        piv = next((i for i in range(fila, n) if a[i][col]), -1)
        if piv == -1:
            continue
        a[piv], a[fila] = a[fila], a[piv]
        inv = pow(a[fila][col], P - 2, P)
        f0 = a[fila] = [x * inv % P for x in a[fila]]
        for i in range(n):
            if i != fila and a[i][col]:
                f = a[i][col]
                ai = a[i]
                for j in range(col, m + 1):
                    ai[j] = (ai[j] - f * f0[j]) % P
        donde[col] = fila
        fila += 1
    if any(a[i][m] for i in range(fila, n)):
        print(-1)
        return
    print(" ".join(str(0 if donde[j] == -1 else a[donde[j]][m]) for j in range(m)))


main()
