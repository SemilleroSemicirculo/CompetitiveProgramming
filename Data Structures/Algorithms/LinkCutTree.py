import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Link-Cut Tree (bosque dinámico: unir, cortar y sumar caminos con splay trees). Basado en KACTL (CC0)
 * Problema  : Library Checker - Dynamic Tree Vertex Add Path Sum (https://judge.yosupo.jp/problem/dynamic_tree_vertex_add_path_sum)
 * Entrada   : N Q; valores a_0 … a_{N−1}; N − 1 aristas; Q consultas: "0 u v w x" quita (u, v) y agrega (w, x),
 *             "1 p x" hace a_p += x, "2 u v" pide la suma de los valores en el camino de u a v
 * Salida    : la respuesta de cada consulta de tipo 2
 * Complejidad: tiempo O((N + Q) log N) amortizado, memoria O(N)
"""


def main():
    data = sys.stdin.buffer.read().split()
    N, Q = int(data[0]), int(data[1])
    # arreglos paralelos en vez de objetos: hijo izquierdo L, derecho R, padre P (en la splay o de camino)
    L = [-1] * N
    R = [-1] * N
    P = [-1] * N
    flip = [False] * N
    val = [int(x) for x in data[2:2 + N]]
    sm = val[:]

    def is_root(x):                       # x es raíz de su splay si su padre no lo tiene como hijo
        p = P[x]
        return p == -1 or (L[p] != x and R[p] != x)

    def push(x):
        if flip[x]:
            L[x], R[x] = R[x], L[x]
            if L[x] != -1:
                flip[L[x]] ^= True
            if R[x] != -1:
                flip[R[x]] ^= True
            flip[x] = False

    def pull(x):
        s = val[x]
        if L[x] != -1:
            s += sm[L[x]]
        if R[x] != -1:
            s += sm[R[x]]
        sm[x] = s

    def rotate(x):
        p = P[x]
        g = P[p]
        if not is_root(p):
            if L[g] == p:
                L[g] = x
            else:
                R[g] = x
        P[x] = g
        if L[p] == x:
            b = R[x]
            L[p] = b
            R[x] = p
        else:
            b = L[x]
            R[p] = b
            L[x] = p
        if b != -1:
            P[b] = p
        P[p] = x
        pull(p)
        pull(x)

    def splay(x):
        st = [x]                          # bajar las marcas de flip de arriba hacia abajo
        y = x
        while not is_root(y):
            y = P[y]
            st.append(y)
        for y in reversed(st):
            push(y)
        while not is_root(x):
            p = P[x]
            if not is_root(p):
                g = P[p]
                rotate(p if (L[g] == p) == (L[p] == x) else x)
            rotate(x)

    def access(x):
        last = -1
        y = x
        while y != -1:
            splay(y)
            R[y] = last
            pull(y)
            last = y
            y = P[y]
        splay(x)

    def make_root(x):
        access(x)
        flip[x] ^= True
        push(x)

    def link(u, v):
        make_root(u)
        P[u] = v

    def cut(u, v):
        make_root(u)
        access(v)                         # ahora u es el hijo izquierdo de v
        L[v] = -1
        P[u] = -1
        pull(v)

    for i in range(N - 1):
        link(int(data[2 + N + 2 * i]), int(data[3 + N + 2 * i]))
    p = 2 + N + 2 * (N - 1)
    out = []
    for _ in range(Q):
        t = data[p]
        if t == b"0":
            u, v, w, x = int(data[p + 1]), int(data[p + 2]), int(data[p + 3]), int(data[p + 4])
            p += 5
            cut(u, v)
            link(w, x)
        elif t == b"1":
            x, d = int(data[p + 1]), int(data[p + 2])
            p += 3
            access(x)
            val[x] += d
            pull(x)
        else:
            u, v = int(data[p + 1]), int(data[p + 2])
            p += 3
            make_root(u)
            access(v)
            out.append(sm[v])
    sys.stdout.write("\n".join(map(str, out)) + "\n" if out else "")


main()
