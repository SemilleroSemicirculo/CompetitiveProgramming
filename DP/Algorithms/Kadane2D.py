import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Kadane 2D (submatriz de suma máxima)
 * Problema  : Clásico, sin problema equivalente en CSES
 * Entrada   : R C, luego la matriz de R filas y C columnas
 * Salida    : máxima suma de una submatriz no vacía
 * Complejidad: tiempo O(R^2 · C), memoria O(R · C)
"""
def main():
    R, C = map(int, input().split())
    mat = [list(map(int, input().split())) for _ in range(R)]

    # se parte de -INF porque todos los valores pueden ser negativos
    best = -INF
    for top in range(R):
        # colSum[j] = suma de la columna j entre las filas top y bot
        colSum = [0] * C
        for bot in range(top, R):
            # al bajar bot se suma una fila más a cada columna
            row = mat[bot]
            for j in range(C):
                colSum[j] += row[j]
            # Kadane sobre colSum
            curr = colSum[0]
            best = max(best, curr)
            for j in range(1, C):
                curr = max(colSum[j], curr + colSum[j])
                best = max(best, curr)
    print(best)


main()
