import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Emparejamiento bipartito máximo (algoritmo de Kuhn)
 * Problema  : CSES 1696 - School Dance (https://cses.fi/problemset/task/1696)
 * Entrada   : n m k, luego k pares "chico chica"
 * Salida    : cantidad máxima de parejas y las parejas
 * Complejidad: tiempo O(V · E), memoria O(V + E)
"""


def main():
    n, m, k = map(int, input().split())
    G = [[] for _ in range(n + 1)]
    for _ in range(k):
        a, b = map(int, input().split())
        G[a].append(b)

    # match[v] = nodo de la izquierda emparejado con v (0 si ninguno)
    match = [0] * (m + 1)

    # busca un camino aumentante desde s (DFS iterativo de Kuhn)
    def kuhn(s, used):
        st = [(s, 0)]
        path = []
        while st:
            u, i = st[-1]
            if i == len(G[u]):
                st.pop()
                if path:
                    path.pop()
                continue
            st[-1] = (u, i + 1)
            v = G[u][i]
            if used[v]:
                continue
            # used evita visitar un nodo dos veces en la misma búsqueda
            used[v] = True
            path.append((u, v))
            # v está libre: se aplica toda la cadena de reasignaciones
            if match[v] == 0:
                for a, b in path:
                    match[b] = a
                return True
            # v está ocupado: se intenta reubicar a quien lo ocupa
            st.append((match[v], 0))
        return False

    total = 0
    # se intenta emparejar a cada nodo de la izquierda
    for u in range(1, n + 1):
        if kuhn(u, [False] * (m + 1)):
            total += 1

    out = [str(total)]
    for v in range(1, m + 1):
        if match[v]:
            out.append("%d %d" % (match[v], v))
    print("\n".join(out))


main()
