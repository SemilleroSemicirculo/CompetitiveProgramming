s = input()
t = input()

n = len(s)
m = len(t)

LCS = [[0 for i in range(m+1)] for j in range(n+1)]

for i in range(1,n+1):
	for j in range(1,m+1):
		if s[i-1] == t[j-1]:
			LCS[i][j] = LCS[i-1][j-1] + 1
		else:
			LCS[i][j] = max(LCS[i-1][j], LCS[i][j-1])

def print_res(i, j):
	if i == 0 or j == 0:
		return ""
	else:
		if s[i-1] == t[j-1]:
			return print_res(i-1, j-1)+s[i-1]
		elif LCS[i-1][j] > LCS[i][j-1]:
			return print_res(i-1, j)
		else:
			return print_res(i, j-1)

print(LCS[n][m])
print(print_res(n, m))