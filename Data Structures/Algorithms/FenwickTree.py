import sys
input = sys.stdin.readline

class Fenwick:
    def __init__(self, n):
        self.n = n
        self.bit = [0] * (n + 1)

    # suma v a la posicion i (1-indexado)
    def add(self, i, v):
        while i <= self.n:
            self.bit[i] += v
            i += i & -i

    # suma del prefijo [1..i]
    def query(self, i):
        res = 0
        while i > 0:
            res += self.bit[i]
            i -= i & -i
        return res

    # suma del rango [l..r]
    def range_query(self, l, r):
        return self.query(r) - self.query(l - 1)

n, q = map(int, input().split())
a = [0] + list(map(int, input().split()))
fw = Fenwick(n)
for i in range(1, n + 1):
    fw.add(i, a[i])

for _ in range(q):
    query = list(map(int, input().split()))
    if query[0] == 1:
        # a[k] = u
        k, u = query[1], query[2]
        fw.add(k, u - a[k])
        a[k] = u
    else:
        print(fw.range_query(query[1], query[2]))
