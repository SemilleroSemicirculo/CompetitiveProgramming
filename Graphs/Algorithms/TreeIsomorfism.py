import sys
from collections import defaultdict
input = sys.stdin.readline

def dfs_centroid(t, u, p):
    """Halla centroides: comprueba que ningún subárbol supere n/2."""
    size_sub[t][u] = 1
    ok = True
    for v in adj[t][u]:
        if v == p: continue
        dfs_centroid(t, v, u)
        size_sub[t][u] += size_sub[t][v]
        if size_sub[t][v] > N//2:
            ok = False
    if N - size_sub[t][u] > N//2:
        ok = False
    if ok:
        centers[t].append(u)

def dfs_canonical(t, u, p):
    """Asigna un ID a cada subárbol según los IDs ordenados de sus hijos."""
    child_ids = []
    for v in adj[t][u]:
        if v == p: continue
        dfs_canonical(t, v, u)
        child_ids.append(canon_id[t][v])
    child_ids.sort()
    key = tuple(child_ids)
    if key not in idmap:
        idmap[key] = len(idmap) + 1
    canon_id[t][u] = idmap[key]

def solve_case():
    global N, adj, size_sub, canon_id, centers, idmap
    N = int(input())
    # inicializar estructuras
    adj   = [defaultdict(list), defaultdict(list)]
    size_sub  = [defaultdict(int), defaultdict(int)]
    canon_id  = [defaultdict(int), defaultdict(int)]
    centers = [[], []]
    # leer dos árboles
    for t in (0,1):
        for _ in range(N-1):
            u, v = map(int, input().split())
            adj[t][u].append(v)
            adj[t][v].append(u)
    # 1) hallar centroides de cada árbol
    for t in (0,1):
        dfs_centroid(t, 1, -1)
    # 2) para cada par de centroides, comparar estructuras
    for c0 in centers[0]:
        for c1 in centers[1]:
            idmap = {}  # reiniciar mapa de patrones
            dfs_canonical(0, c0, -1)
            dfs_canonical(1, c1, -1)
            if canon_id[0][c0] == canon_id[1][c1]:
                print("YES")
                return
    print("NO")

def main():
    T = int(input())
    for _ in range(T):
        solve_case()

if __name__ == "__main__":
    main()
