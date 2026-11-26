import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Autómata de sufijos (el menor autómata que reconoce todos los sufijos de s)
 * Problema  : CSES 2105 - Distinct Substrings (https://cses.fi/problemset/task/2105)
 * Entrada   : una cadena s (|s| ≤ 10^5, letras a–z)
 * Salida    : la cantidad de subcadenas distintas de s
 * Complejidad: tiempo O(|s|), memoria O(|s|) (transiciones en diccionarios)
"""


def main():
    s = input().strip()
    length = [0]
    link = [-1]
    nxt = [{}]
    ultimo = 0
    for c in s:
        cur = len(length)
        length.append(length[ultimo] + 1)
        link.append(-1)
        nxt.append({})
        p = ultimo
        while p != -1 and c not in nxt[p]:
            nxt[p][c] = cur
            p = link[p]
        if p == -1:
            link[cur] = 0
        else:
            q = nxt[p][c]
            if length[p] + 1 == length[q]:
                link[cur] = q
            else:
                clon = len(length)          # separar q en dos estados
                length.append(length[p] + 1)
                link.append(link[q])
                nxt.append(dict(nxt[q]))
                while p != -1 and nxt[p].get(c) == q:
                    nxt[p][c] = clon
                    p = link[p]
                link[q] = link[cur] = clon
        ultimo = cur
    print(sum(length[v] - length[link[v]] for v in range(1, len(length))))


main()
