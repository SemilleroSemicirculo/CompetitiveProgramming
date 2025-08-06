import sys
import bisect
input = sys.stdin.readline

n, target = map(int, input().split())
a = list(map(int, input().split()))
# asume a ordenado
i = bisect.bisect_left(a, target)
if i < n and a[i] == target:
    print("FOUND", i)
else:
    print("NOT FOUND")
