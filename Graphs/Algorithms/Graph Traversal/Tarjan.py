import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Componentes fuertemente conexas (Tarjan)
 * Problema  : CSES 1682 - Flight Routes Check (https://cses.fi/problemset/task/1682)
 * Entrada   : n m, luego m aristas dirigidas "a b"
 * Salida    : YES si todo nodo llega a todo nodo; si no, NO y un par "a b" sin camino de a hacia b
 * Complejidad: tiempo O(n + m), memoria O(n + m)
"""


# Tarjan: componentes fuertemente conexas (SCC) con una sola DFS (iterativa)
def tarjan(G, n):
    # discovered[v] = momento en que se visitó v, low[v] = menor tiempo alcanzable desde su subárbol
    discovered = [-1] * (n + 1)
    low = [0] * (n + 1)
    # pila de nodos de la SCC actual; in_stack evita usar aristas hacia SCC ya cerradas
    in_stack = [False] * (n + 1)
    ss = []
    # scc_index[v] = componente de v
    scc_index = [-1] * (n + 1)
    tempo = 0
    count = 0
    for s in range(1, n + 1):
        if discovered[s] != -1:
            continue
        discovered[s] = low[s] = tempo
        tempo += 1
        ss.append(s)
        in_stack[s] = True
        call = [(s, 0)]
        while call:
            v, i = call[-1]
            if i < len(G[v]):
                call[-1] = (v, i + 1)
                u = G[v][i]
                if discovered[u] == -1:
                    # arista de árbol: se baja
                    discovered[u] = low[u] = tempo
                    tempo += 1
                    ss.append(u)
                    in_stack[u] = True
                    call.append((u, 0))
                elif in_stack[u]:
                    # arista hacia atrás dentro de la misma componente
                    low[v] = min(low[v], discovered[u])
            else:
                call.pop()
                if call:
                    p = call[-1][0]
                    low[p] = min(low[p], low[v])
                # v es la raíz de una SCC: se desapila hasta v
                if low[v] == discovered[v]:
                    while True:
                        x = ss.pop()
                        in_stack[x] = False
                        scc_index[x] = count
                        if x == v:
                            break
                    count += 1
    return count, scc_index


def main():
    n, m = map(int, input().split())
    G = [[] for _ in range(n + 1)]
    edges = []
    for _ in range(m):
        a, b = map(int, input().split())
        G[a].append(b)
        edges.append((a, b))

    count, idx = tarjan(G, n)
    # una sola SCC = fuertemente conexo
    if count == 1:
        print("YES")
        return
    # hay que mostrar un par (a, b) tal que no se pueda ir de a a b
    print("NO")
    # una arista i->j entre componentes distintas: no existe camino de j a i
    for a, b in edges:
        if idx[a] != idx[b]:
            print(b, a)
            return
    # si no hay aristas entre componentes, dos nodos de componentes distintas sirven
    for v in range(2, n + 1):
        if idx[v] != idx[1]:
            print(1, v)
            return


main()
