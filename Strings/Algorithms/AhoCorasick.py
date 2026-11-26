import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Aho-Corasick (trie con enlaces de fallo: muchos patrones a la vez en tiempo lineal)
 * Problema  : CSES 2102 - Finding Patterns (https://cses.fi/problemset/task/2102)
 * Entrada   : el texto s; k; luego k patrones
 * Salida    : para cada patrón, YES si aparece en s y NO si no
 * Complejidad: tiempo O(|s| + Σ|p|), memoria O(Σ|p|) (transiciones en diccionarios)
"""
from collections import deque


def main():
    s = input().strip()
    k = int(input())
    hijos = [{}]                          # trie con diccionarios: solo las aristas que existen
    fin = []
    for _ in range(k):
        u = 0
        for ch in input().strip():
            v = hijos[u].get(ch)
            if v is None:
                v = len(hijos)
                hijos[u][ch] = v
                hijos.append({})
            u = v
        fin.append(u)
    N = len(hijos)
    link = [0] * N
    orden = []
    q = deque(hijos[0].values())
    while q:
        u = q.popleft()
        orden.append(u)
        for ch, v in hijos[u].items():
            f = link[u]                   # buscar el sufijo más largo que se pueda extender con ch
            while f and ch not in hijos[f]:
                f = link[f]
            w = hijos[f].get(ch, 0)
            link[v] = w if w != v else 0
            q.append(v)
    visto = [0] * N
    u = 0
    for ch in s:
        while u and ch not in hijos[u]:
            u = link[u]
        u = hijos[u].get(ch, 0)
        visto[u] = 1
    for u in reversed(orden):
        if visto[u]:
            visto[link[u]] = 1
    print("\n".join("YES" if visto[f] else "NO" for f in fin))


main()
