import sys
input = sys.stdin.readline

def binary_search(a, target):
    lo, hi = 0, len(a) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if a[mid] == target:
            return mid
        if a[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1

n, target = map(int, input().split())
a = list(map(int, input().split()))
idx = binary_search(a, target)
if idx != -1:
    print("FOUND", idx)
else:
    print("NOT FOUND")
