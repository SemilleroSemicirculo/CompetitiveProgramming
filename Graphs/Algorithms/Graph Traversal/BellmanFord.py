import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Bellman-Ford (detección de ciclo negativo)
 * Problema  : CSES 1197 - Cycle Finding (https://cses.fi/problemset/task/1197)
 * Entrada   : n m, luego m aristas dirigidas "a b c" (peso c)
 * Salida    : NO, o YES y un ciclo de peso negativo
 * Complejidad: tiempo O(n·m), memoria O(n + m)
"""


def main():
    n, m = map(int, input().split())
    # aristas (a, b, c)
    edges = [tuple(map(int, input().split())) for _ in range(m)]

    # dist = 0 para todos: equivale a un nodo fuente virtual conectado a todos
    dist = [0] * (n + 1)
    parent = [0] * (n + 1)
    last = -1
    # n rondas de relajación; si en la n-ésima aún mejora, hay ciclo negativo
    for _ in range(n):
        last = -1
        for a, b, c in edges:
            if dist[a] + c < dist[b]:
                dist[b] = dist[a] + c
                parent[b] = a
                last = b
        if last == -1:
            break

    if last == -1:
        print("NO")
        return
    # retroceder n veces para asegurar estar dentro del ciclo
    for _ in range(n):
        last = parent[last]
    # se recorre el ciclo siguiendo parent[] hasta volver a last
    cycle = [last]
    v = parent[last]
    while v != last:
        cycle.append(v)
        v = parent[v]
    cycle.append(last)
    cycle.reverse()
    print("YES")
    print(*cycle)


main()
