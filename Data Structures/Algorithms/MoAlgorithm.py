import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Algoritmo de Mo (consultas offline con raíz cuadrada)
 * Problema  : CSES 1734 - Distinct Values Queries (https://cses.fi/problemset/task/1734)
 * Entrada   : n q, n enteros, luego q consultas "a b"
 * Salida    : cantidad de valores distintos en cada rango [a, b]
 * Complejidad: tiempo O((n + q) √n), memoria O(n)
"""


def main():
    data = sys.stdin.buffer.read().split()
    n, q = int(data[0]), int(data[1])
    a = data[2:n + 2]
    # se comprimen los valores a 0..k-1
    comp = {}
    a = [comp.setdefault(v, len(comp)) for v in a]

    # tamaño de bloque ≈ √n
    block = max(1, int(n ** 0.5))
    L_ = [int(x) - 1 for x in data[n + 2::2]]
    R_ = [int(x) - 1 for x in data[n + 3::2]]

    # se ordenan las consultas por bloque del extremo izquierdo (y alternando el derecho)
    def key(i):
        b = L_[i] // block
        return b * 10 ** 6 + (R_[i] if b % 2 == 0 else n - R_[i])

    order = sorted(range(q), key=key)

    # cnt[v] = apariciones de v en la ventana actual, distinct = valores distintos
    cnt = [0] * len(comp)
    ans = [0] * q
    distinct, L, R = 0, 0, -1
    # se mueven los extremos de la ventana de una consulta a la siguiente
    for i in order:
        l, r = L_[i], R_[i]
        while L > l:
            L -= 1
            v = a[L]
            if cnt[v] == 0:
                distinct += 1
            cnt[v] += 1
        while R < r:
            R += 1
            v = a[R]
            if cnt[v] == 0:
                distinct += 1
            cnt[v] += 1
        while L < l:
            v = a[L]
            cnt[v] -= 1
            if cnt[v] == 0:
                distinct -= 1
            L += 1
        while R > r:
            v = a[R]
            cnt[v] -= 1
            if cnt[v] == 0:
                distinct -= 1
            R -= 1
        ans[i] = distinct
    print("\n".join(map(str, ans)))


main()
