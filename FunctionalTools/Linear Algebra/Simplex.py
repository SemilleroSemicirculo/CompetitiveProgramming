import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Método símplex (programación lineal) con dos fases (basado en KACTL, CC0)
 * Problema  : Problema propio: maximizar c·x sujeto a A·x ≤ b, x ≥ 0
 * Entrada   : n m (variables y restricciones); c_1 … c_n; luego m filas "a_1 … a_n b"
 * Salida    : el valor óptimo con 6 decimales, o INFEASIBLE, o UNBOUNDED
 * Complejidad: exponencial en el peor caso, pero muy rápido en la práctica; memoria O(n · m)
"""

EPS = 1e-9


def lp(A, b, c):
    m, n = len(b), len(c)
    N = list(range(n)) + [-1]
    B = [n + i for i in range(m)]
    D = [[0.0] * (n + 2) for _ in range(m + 2)]
    for i in range(m):
        for j in range(n):
            D[i][j] = float(A[i][j])
        D[i][n] = -1.0
        D[i][n + 1] = float(b[i])
    for j in range(n):
        D[m][j] = -float(c[j])
    D[m + 1][n] = 1.0

    def pivot(r, s):
        inv = 1.0 / D[r][s]
        Dr = D[r]
        for i in range(m + 2):
            if i != r and abs(D[i][s]) > EPS:
                Di = D[i]
                f = Di[s] * inv
                for j in range(n + 2):
                    Di[j] -= Dr[j] * f
                Di[s] = Dr[s] * f
        for j in range(n + 2):
            if j != s:
                Dr[j] *= inv
        for i in range(m + 2):
            if i != r:
                D[i][s] *= -inv
        Dr[s] = inv
        B[r], N[s] = N[s], B[r]

    def simplex(fase):
        x = m + fase - 1
        while True:
            s = -1
            for j in range(n + 1):
                if N[j] != -fase and (s == -1 or (D[x][j], N[j]) < (D[x][s], N[s])):
                    s = j
            if D[x][s] >= -EPS:
                return True
            r = -1
            for i in range(m):
                if D[i][s] > EPS and (r == -1 or (D[i][n + 1] / D[i][s], B[i]) < (D[r][n + 1] / D[r][s], B[r])):
                    r = i
            if r == -1:
                return False
            pivot(r, s)

    r = min(range(m), key=lambda i: D[i][n + 1]) if m else 0
    if m and D[r][n + 1] < -EPS:
        pivot(r, n)
        if not simplex(2) or D[m + 1][n + 1] < -EPS:
            return None                      # infactible
        for i in range(m):
            if B[i] == -1:
                s = 0
                for j in range(1, n + 1):
                    if (D[i][j], N[j]) < (D[i][s], N[s]):
                        s = j
                pivot(i, s)
    return D[m][n + 1] if simplex(1) else float("inf")


def main():
    data = sys.stdin.read().split()
    n, m = int(data[0]), int(data[1])
    c = [float(x) for x in data[2:2 + n]]
    p = 2 + n
    A, b = [], []
    for _ in range(m):
        A.append([float(x) for x in data[p:p + n]])
        b.append(float(data[p + n]))
        p += n + 1
    res = lp(A, b, c)
    if res is None:
        print("INFEASIBLE")
    elif res == float("inf"):
        print("UNBOUNDED")
    else:
        print(f"{0.0 if abs(res) < 5e-7 else res:.6f}")


main()
