n = int(input())
for i in range(1 << n):
    gn = i ^ (i >> 1)
    print(format(gn, f'0{n}b'))