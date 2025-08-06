import sys
input = sys.stdin.readline

# leer datos
n, W = map(int, input().split())
wt = [0]*n
val = [0]*n
for i in range(n):
    wt[i], val[i] = map(int, input().split())

# dp[w] = máximo valor con capacidad w
dp = [0] * (W+1)
for i in range(n):
    for w in range(W, wt[i]-1, -1):
        dp[w] = max(dp[w], dp[w - wt[i]] + val[i])

print(dp[W])
