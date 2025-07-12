import sys
input = sys.stdin.readline

def ternary_search(l, r, f):
    while r - l > 3:
        m1 = l + (r - l) // 3
        m2 = r - (r - l) // 3
        if f(m1) < f(m2):
            l = m1
        else:
            r = m2
    best = f(l)
    for x in range(l+1, r+1):
        best = max(best, f(x))
    return best

L, R = map(int, input().split())
# ejemplo unimodal: f(x) = -(x-3)^2 + 10
def f(x):
    return -(x-3)*(x-3) + 10

print(ternary_search(L, R, f))
