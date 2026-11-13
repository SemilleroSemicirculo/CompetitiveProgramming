import sys
input = sys.stdin.readline

class SparseTable:
    def __init__(self, a):
        n = len(a)
        self.st = [a[:]]
        j = 1
        while (1 << j) <= n:
            prev = self.st[-1]
            half = 1 << (j - 1)
            self.st.append([min(prev[i], prev[i + half]) for i in range(n - (1 << j) + 1)])
            j += 1

    # minimo en el rango [l..r] (0-indexado), O(1)
    def query(self, l, r):
        j = (r - l + 1).bit_length() - 1
        return min(self.st[j][l], self.st[j][r - (1 << j) + 1])

n, q = map(int, input().split())
a = list(map(int, input().split()))
table = SparseTable(a)
out = []
for _ in range(q):
    l, r = map(int, input().split())
    out.append(table.query(l - 1, r - 1))
print("\n".join(map(str, out)))
