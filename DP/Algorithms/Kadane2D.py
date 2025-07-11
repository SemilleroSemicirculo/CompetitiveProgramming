import sys
input = sys.stdin.readline

R, C = map(int, input().split())
mat = [list(map(int, input().split())) for _ in range(R)]

best = -10**30
# recorrer pares de filas y acumular columnas
for top in range(R):
    colSum = [0]*C
    for bot in range(top, R):
        for j in range(C):
            colSum[j] += mat[bot][j]
        # Kadane 1D en colSum
        curr = colSum[0]
        best = max(best, curr)
        for x in colSum[1:]:
            curr = max(x, curr + x)
            best = max(best, curr)

print(best)
