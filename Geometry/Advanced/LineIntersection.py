import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Intersección de dos rectas con producto cruz (forma paramétrica)
 * Problema  : Problema propio: rectas dadas por dos puntos cada una (|coord| ≤ 10^4)
 * Entrada   : T casos; cada uno x1 y1 x2 y2 x3 y3 x4 y4 (recta por P1, P2 y recta por P3, P4)
 * Salida    : "POINT x y" con 6 decimales, "PARALLEL" si no se cortan o "SAME" si son la misma recta
 * Complejidad: tiempo O(1) por caso, memoria O(1)
"""


def main():
    out = []
    for _ in range(int(input())):
        ax, ay, bx, by, cx, cy, dx, dy = map(int, input().split())
        rx, ry, sx, sy = bx - ax, by - ay, dx - cx, dy - cy
        den = rx * sy - ry * sx
        if den == 0:
            out.append("SAME" if rx * (cy - ay) - ry * (cx - ax) == 0 else "PARALLEL")
            continue
        t = ((cx - ax) * sy - (cy - ay) * sx) / den
        x, y = ax + t * rx, ay + t * ry
        x = 0.0 if abs(x) < 5e-7 else x       # evita imprimir "-0.000000"
        y = 0.0 if abs(y) < 5e-7 else y
        out.append(f"POINT {x:.6f} {y:.6f}")
    print("\n".join(out))


main()
