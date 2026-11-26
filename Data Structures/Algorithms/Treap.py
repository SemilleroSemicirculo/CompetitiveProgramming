import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Treap implícito (árbol cartesiano por posición: partir y unir secuencias en O(log n))
 * Problema  : CSES 2072 - Cut and Paste (https://cses.fi/problemset/task/2072)
 * Entrada   : n, m; una cadena de largo n; m operaciones "a b": cortar [a, b] y pegarlo al final
 * Salida    : la cadena final
 * Complejidad: tiempo O((n + m) log n) esperado, memoria O(n)
"""
import random


def main():
    n, m = map(int, input().split())
    s = input().strip()
    ch = [""] + list(s)
    pr = [0] + [random.random() for _ in range(n)]
    Lc = [0] * (n + 1)
    Rc = [0] * (n + 1)
    sz = [0] + [1] * (n + 1)
    sz = sz[:n + 1]

    def upd(u):
        sz[u] = 1 + sz[Lc[u]] + sz[Rc[u]]

    def split(u, k):
        """(primeros k, resto) sin recursión: se baja anotando dónde colgar cada pedazo."""
        izq, der = [], []                 # nodos que terminan a la izquierda / derecha
        while u:
            if sz[Lc[u]] < k:
                k -= sz[Lc[u]] + 1
                izq.append(u)
                u = Rc[u]
            else:
                der.append(u)
                u = Lc[u]
        # encadenar: cada nodo de izq cuelga el siguiente de izq como hijo derecho
        a = 0
        for v in reversed(izq):
            Rc[v] = a
            upd(v)
            a = v
        b = 0
        for v in reversed(der):
            Lc[v] = b
            upd(v)
            b = v
        return a, b

    def merge(a, b):
        if not a or not b:
            return a or b
        pila = []                         # bajar por el borde derecho de a / izquierdo de b
        while a and b:
            if pr[a] > pr[b]:
                pila.append((a, True))
                a = Rc[a]
            else:
                pila.append((b, False))
                b = Lc[b]
        res = a or b
        for v, era_a in reversed(pila):
            if era_a:
                Rc[v] = res
            else:
                Lc[v] = res
            upd(v)
            res = v
        return res

    # construcción en O(n) con pila (las prioridades forman un heap)
    raiz = 0
    st = []
    for u in range(1, n + 1):
        ultimo = 0
        while st and pr[st[-1]] < pr[u]:
            ultimo = st.pop()
            upd(ultimo)
        Lc[u] = ultimo
        if st:
            Rc[st[-1]] = u
        st.append(u)
    while st:
        upd(st.pop())
    # el primero que quedó en la pila (de prioridad máxima) es la raíz
    raiz = max(range(1, n + 1), key=lambda i: pr[i])
    # recalcular tamaños en postorden
    orden, pila = [], [raiz]
    while pila:
        u = pila.pop()
        orden.append(u)
        if Lc[u]:
            pila.append(Lc[u])
        if Rc[u]:
            pila.append(Rc[u])
    for u in reversed(orden):
        upd(u)
    for _ in range(m):
        a, b = map(int, input().split())
        x, y = split(raiz, a - 1)
        y, z = split(y, b - a + 1)
        raiz = merge(merge(x, z), y)
    res, pila, u = [], [], raiz
    while u or pila:
        if u:
            pila.append(u)
            u = Lc[u]
        else:
            u = pila.pop()
            res.append(ch[u])
            u = Rc[u]
    print("".join(res))


main()
