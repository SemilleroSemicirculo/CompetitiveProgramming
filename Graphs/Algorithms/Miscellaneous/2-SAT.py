import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : 2-SAT con componentes fuertemente conexas (Tarjan)
 * Problema  : CSES 1684 - Giant Pizza (https://cses.fi/problemset/task/1684)
 * Entrada   : n m, luego n líneas "+ a - b" (deseos de cada persona sobre m ingredientes)
 * Salida    : una asignación "+/-" por ingrediente, o IMPOSSIBLE
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
    # 2-SAT: el nodo x es "x verdadero" y x+m es su negación
    neg = lambda u: u - m if u > m else u + m
    G = [[] for _ in range(2 * m + 1)]
    for _ in range(n):
        s1, u, s2, v = input().split()
        u = int(u) if s1 == '+' else int(u) + m
        v = int(v) if s2 == '+' else int(v) + m
        # cada cláusula (u ∨ v) agrega las implicaciones ¬u → v y ¬v → u
        G[neg(u)].append(v)
        G[neg(v)].append(u)

    # SCC sobre el grafo de implicaciones
    _, idx = tarjan(G, 2 * m)
    res = []
    for x in range(1, m + 1):
        # si x y ¬x están en la misma SCC no hay solución
        if idx[x] == idx[x + m]:
            print("IMPOSSIBLE")
            return
        # x es verdadera si su SCC va después en el orden topológico (Tarjan numera al revés)
        res.append('+' if idx[x] < idx[x + m] else '-')
    print(*res)


main()
