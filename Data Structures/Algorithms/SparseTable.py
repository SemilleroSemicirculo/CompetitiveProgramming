import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Sparse Table (mínimo de rango en O(1))
 * Problema  : CSES 1647 - Static Range Minimum Queries (https://cses.fi/problemset/task/1647)
 * Entrada   : n q, n enteros, luego q consultas "a b"
 * Salida    : el mínimo de cada rango
 * Complejidad: tiempo O(n log n + q), memoria O(n log n)
"""


def main():
    n, q = map(int, input().split())
    a = list(map(int, input().split()))

    # st[j][i] = mínimo del rango que empieza en i con longitud 2^j
    st = [a]
    j = 1
    # cada nivel combina dos rangos del nivel anterior
    while (1 << j) <= n:
        prev, half = st[-1], 1 << (j - 1)
        st.append([min(prev[i], prev[i + half]) for i in range(n - (1 << j) + 1)])
        j += 1

    out = []
    for _ in range(q):
        l, r = map(int, input().split())
        l -= 1
        # se cubre [l..r] con dos rangos de longitud 2^k que se pueden solapar (válido para el mínimo)
        k = (r - l).bit_length() - 1
        out.append(min(st[k][l], st[k][r - (1 << k)]))
    print("\n".join(map(str, out)))


main()
