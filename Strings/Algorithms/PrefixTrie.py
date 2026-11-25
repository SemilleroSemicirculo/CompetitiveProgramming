import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Trie (prefix tree) + DP de conteo de formas
 * Problema  : CSES 1731 - Word Combinations (https://cses.fi/problemset/task/1731)
 * Entrada   : cadena s, k, luego k palabras
 * Salida    : cantidad de formas de construir s con las palabras, módulo 10^9+7
 * Complejidad: tiempo O(|s|^2 + suma de longitudes), memoria O(suma de longitudes)
"""


MODW = 1000000007  # este problema pide módulo 10^9+7


# árbol de prefijos: cada arista (nodo, letra) se guarda en un solo diccionario
# con clave nodo * 32 + letra; flag marca los nodos donde termina una palabra
class Trie:
    def __init__(self):
        self.child = {}
        self.flag = [False]

    # inserta una palabra letra por letra
    def insert(self, word):
        v = 0
        for ch in word:
            key = v * 32 + ch - 96
            nxt = self.child.get(key)
            if nxt is None:
                nxt = len(self.flag)
                self.child[key] = nxt
                self.flag.append(False)
            v = nxt
        self.flag[v] = True

    # la palabra existe si el camino existe y termina marcada
    def search(self, word):
        v = 0
        for ch in word:
            v = self.child.get(v * 32 + ch - 96)
            if v is None:
                return False
        return self.flag[v]


def main():
    data = sys.stdin.buffer.read().split()
    s = data[0]
    k = int(data[1])
    trie = Trie()
    for w in data[2:2 + k]:
        trie.insert(w)

    # dp[i] = formas de construir el sufijo s[i..]
    n = len(s)
    dp = [0] * (n + 1)
    dp[n] = 1
    child, flag = trie.child, trie.flag
    # desde cada posición se baja por el trie y cada palabra completa suma dp[j + 1]
    for i in range(n - 1, -1, -1):
        v = 0
        total = 0
        for j in range(i, n):
            v = child.get(v * 32 + s[j] - 96)
            if v is None:
                break
            if flag[v]:
                total += dp[j + 1]
        dp[i] = total % MODW
    print(dp[0])


main()
