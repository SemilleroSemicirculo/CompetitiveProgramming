# O(n log n) implementation of LIS
import bisect

n = int(input())
a = list(map(int, input().split()))

M = []
R = []
    
for i in range(n):
    ind = bisect.bisect_left(R, a[i])
        
    if ind == len(R):
        R.append(a[i])
        M.append(i)
    else:
        R[ind] = a[i]
        M[ind] = i

print(R, len(R))