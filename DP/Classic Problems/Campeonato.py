p = 0.3
q = 1 - p

n = 10
P = [[0 for i in range(n+1)] for i in range(n+1)]

for i in range(1, n+1):
    P[0][i] = 1
    P[i][0] = 0
    for j in range(1, i):
        P[j][i-j] = p*P[j-1][i-j] + q*P[j][i-j-1]


for i in range(1, n+1):
    for j in range(0, n-i+1):
        P[i+j][n-j] = p*P[i+j-1][n-j] + q*P[i+j][n-j-1]

print(P[n][n])