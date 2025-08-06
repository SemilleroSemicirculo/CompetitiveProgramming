import sys
input = sys.stdin.readline

n, target = map(int, input().split())
coins = list(map(int, input().split()))

# dp[x] = mínimo número de monedas para sumar x
dp = [float('inf')] * (target+1)
dp[0] = 0
for c in coins:
    for x in range(c, target+1):
        prev = dp[x-c]
        if prev != float('inf'):
            dp[x] = min(dp[x], prev + 1)

print(-1 if dp[target] == float('inf') else dp[target])
