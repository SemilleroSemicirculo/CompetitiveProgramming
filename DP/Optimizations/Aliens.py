import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Truco de Aliens / relajación lagrangiana (quitar la restricción "a lo sumo k" con una penalización λ)
 * Problema  : problema propio (k subarreglos disjuntos de suma máxima)
 * Entrada   : n k; a_1 … a_n (|a_i| ≤ 10^9)
 * Salida    : la suma máxima de a lo sumo k subarreglos no vacíos y disjuntos (0 si conviene no tomar ninguno)
 * Complejidad: tiempo O(n log V) (V = rango de λ), memoria O(n)
"""


def main():
    data = sys.stdin.buffer.read().split()
    n, k = int(data[0]), int(data[1])
    a = [int(x) for x in data[2:2 + n]]

    def resolver(lam):
        # pares (valor, −cantidad): comparar tuplas da "más valor y, a igual valor, menos subarreglos"
        fv, fc = 0, 0
        dv, dc = -(1 << 62), 0
        for x in a:
            av, ac = fv - lam + x, fc + 1
            sv, sc = dv + x, dc
            if av > sv or (av == sv and ac < sc):
                ndv, ndc = av, ac
            else:
                ndv, ndc = sv, sc
            if dv > fv or (dv == fv and dc < fc):
                fv, fc = dv, dc
            dv, dc = ndv, ndc
        if dv > fv or (dv == fv and dc < fc):
            return dv, dc
        return fv, fc

    lo, hi = 0, 3 * 10**14
    while lo < hi:
        mid = (lo + hi) // 2
        if resolver(mid)[1] <= k:
            hi = mid
        else:
            lo = mid + 1
    print(resolver(lo)[0] + lo * k)


main()
