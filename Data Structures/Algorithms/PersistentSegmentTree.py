import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Segment Tree persistente (cada cambio crea O(log n) nodos nuevos y comparte el resto)
 * Problema  : CSES 1737 - Range Queries and Copies (https://cses.fi/problemset/task/1737)
 * Entrada   : n, q; el arreglo; consultas "1 k a x" (en la copia k, pos a = x), "2 k a b" (suma de
 *             [a, b] en la copia k) o "3 k" (crear una copia de la copia k)
 * Salida    : la respuesta de cada consulta de tipo 2
 * Complejidad: tiempo O((n + q) log n), memoria O(n + q log n)
"""


def main():
    data = sys.stdin.buffer.read().split()
    n, q = int(data[0]), int(data[1])
    a = [0] + [int(x) for x in data[2:2 + n]]
    Lc, Rc, S = [0], [0], [0]            # nodo 0 = vacío
    # construcción iterativa por niveles: (nodo, l, r) se arma de abajo hacia arriba
    def nuevo(l, r, s):
        Lc.append(l); Rc.append(r); S.append(s)
        return len(S) - 1
    def construir(l, r):
        pila = [(l, r, False)]
        res = []
        while pila:
            lo, hi, listo = pila.pop()
            if lo == hi:
                res.append(nuevo(0, 0, a[lo]))
            elif listo:
                rr = res.pop(); ll_ = res.pop()
                res.append(nuevo(ll_, rr, S[ll_] + S[rr]))
            else:
                m = (lo + hi) // 2
                pila.append((lo, hi, True))
                pila.append((m + 1, hi, False))
                pila.append((lo, m, False))
        return res[0]
    raiz = [0, construir(1, n)]
    p = 2 + n
    out = []
    for _ in range(q):
        t = data[p]
        if t == b"1":
            k, pos, x = int(data[p + 1]), int(data[p + 2]), int(data[p + 3])
            p += 4
            camino = []                  # bajar guardando los nodos visitados
            u, l, r = raiz[k], 1, n
            while l < r:
                m = (l + r) // 2
                camino.append((u, pos <= m))
                if pos <= m:
                    u, r = Lc[u], m
                else:
                    u, l = Rc[u], m + 1
            v = nuevo(0, 0, x)           # hoja nueva; subir copiando
            for u, izq in reversed(camino):
                if izq:
                    v = nuevo(v, Rc[u], S[v] + S[Rc[u]])
                else:
                    v = nuevo(Lc[u], v, S[Lc[u]] + S[v])
            raiz[k] = v
        elif t == b"2":
            k, lo, hi = int(data[p + 1]), int(data[p + 2]), int(data[p + 3])
            p += 4
            tot = 0
            pila = [(raiz[k], 1, n)]
            while pila:
                u, l, r = pila.pop()
                if hi < l or r < lo:
                    continue
                if lo <= l and r <= hi:
                    tot += S[u]
                    continue
                m = (l + r) // 2
                pila.append((Lc[u], l, m))
                pila.append((Rc[u], m + 1, r))
            out.append(tot)
        else:
            raiz.append(raiz[int(data[p + 1])])
            p += 2
    print("\n".join(map(str, out)))


main()
