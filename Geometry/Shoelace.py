def mod(x, n):
    return (x % n + n) % n

n = 4
points = [
    (0, 0),
    (0, 1),
    (1, 1),
    (1, 0),
]

res = 0
for i in range(n):
    res += points[i][0] * (points[mod(i + 1, n)][1] - points[mod(i - 1, n)][1])

res = abs(res)  # Esto es 2 veces el área
print(res)
