n = int(input())
a = list(map(int, input().split()))

DP = [1 for i in range(n)]

for i in range(1, n):
    for j in range(i):
        if(a[j] < a[i]):
            DP[i] = max(DP[i], 1 + DP[j])

print(max(DP))