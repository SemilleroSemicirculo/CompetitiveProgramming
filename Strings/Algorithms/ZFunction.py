import sys
input = sys.stdin.readline

# z[i] = longitud del prefijo comun mas largo entre s y s[i:]
def z_function(s):
    n = len(s)
    z = [0] * n
    l = r = 0
    for i in range(1, n):
        if i < r:
            z[i] = min(r - i, z[i - l])
        while i + z[i] < n and s[z[i]] == s[i + z[i]]:
            z[i] += 1
        if i + z[i] > r:
            l, r = i, i + z[i]
    return z

s = input().strip()
t = input().strip()

# ocurrencias de t en s: z sobre t + '#' + s
combined = t + '#' + s
z = z_function(combined)
print(sum(1 for i in range(len(t) + 1, len(combined)) if z[i] == len(t)))
