import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Convex Hull Trick con pendientes y consultas monótonas (deque de rectas)
 * Problema  : CSES 2084 - Monster Game I (https://cses.fi/problemset/task/2084)
 * Entrada   : n, x; fuerzas s_1 < … < s_n; factores x ≥ f_1 ≥ … ≥ f_n
 * Salida    : el tiempo mínimo para matar al monstruo n (matar el i con factor f cuesta s_i · f)
 * Complejidad: tiempo O(n), memoria O(n)
"""
from collections import deque


def main():
    n, x = map(int, input().split())
    s = list(map(int, input().split()))
    f = list(map(int, input().split()))
    hull = deque([(x, 0)])          # rectas (pendiente, intercepto) = (factor, dp)

    def sobra(l1, l2, l3):          # l2 queda tapada por l1 y l3
        return (l3[1] - l1[1]) * (l1[0] - l2[0]) <= (l2[1] - l1[1]) * (l1[0] - l3[0])

    dp = 0
    for i in range(n):
        q = s[i]
        while len(hull) >= 2 and hull[1][0] * q + hull[1][1] <= hull[0][0] * q + hull[0][1]:
            hull.popleft()
        dp = hull[0][0] * q + hull[0][1]
        nueva = (f[i], dp)
        if hull[-1][0] == nueva[0]:
            if hull[-1][1] <= nueva[1]:
                continue
            hull.pop()
        while len(hull) >= 2 and sobra(hull[-2], hull[-1], nueva):
            hull.pop()
        hull.append(nueva)
    print(dp)


main()
