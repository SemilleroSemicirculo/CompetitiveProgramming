import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Segment Tree con nodos compuestos (suma y mejor prefijo)
 * Problema  : CSES 2166 - Prefix Sum Queries (https://cses.fi/problemset/task/2166)
 * Entrada   : n q, n enteros, luego q consultas "1 k u" (x_k = u) o "2 a b"
 * Salida    : para cada consulta de tipo 2, la máxima suma de un prefijo de [a, b] (el prefijo vacío vale 0)
 * Complejidad: tiempo O((n + q) log n), memoria O(n)
"""


def main():
    data = sys.stdin.buffer.read().split()
    n, q = int(data[0]), int(data[1])
    sz = 1
    while sz < n:
        sz <<= 1
    # cada nodo: S = suma del tramo, P = mejor prefijo (≥ 0, se permite el vacío)
    S = [0] * (2 * sz)
    P = [0] * (2 * sz)
    for i in range(n):
        x = int(data[2 + i])
        S[sz + i] = x
        P[sz + i] = x if x > 0 else 0
    for v in range(sz - 1, 0, -1):
        l, r = 2 * v, 2 * v + 1
        S[v] = S[l] + S[r]
        # mejor prefijo: el de la izquierda, o toda la izquierda más un prefijo de la derecha
        P[v] = max(P[l], S[l] + P[r])
    out = []
    pos = 2 + n
    for _ in range(q):
        ty, a, b = data[pos], int(data[pos + 1]), int(data[pos + 2])
        pos += 3
        if ty == b'1':
            v = sz + a - 1
            S[v] = b
            P[v] = b if b > 0 else 0
            v >>= 1
            while v:
                l = 2 * v
                S[v] = S[l] + S[l + 1]
                P[v] = max(P[l], S[l] + P[l + 1])
                v >>= 1
        else:
            # se juntan los nodos de izquierda a derecha (el orden importa)
            l, r = a - 1 + sz, b + sz
            ls, lp = 0, 0
            right = []
            while l < r:
                if l & 1:
                    lp = max(lp, ls + P[l])
                    ls += S[l]
                    l += 1
                if r & 1:
                    r -= 1
                    right.append(r)
                l >>= 1
                r >>= 1
            for v in reversed(right):
                lp = max(lp, ls + P[v])
                ls += S[v]
            out.append(lp)
    print('\n'.join(map(str, out)))


main()
