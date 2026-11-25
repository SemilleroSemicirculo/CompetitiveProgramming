import sys
import math

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Vectores 3D (suma, producto punto y cruz, norma, proyección, ángulo)
 * Problema  : Sin problema equivalente en CSES; formato propio
 * Entrada   : seis reales: ax ay az bx by bz (para vectores en el plano, z = 0)
 * Salida    : a+b, a-b, a×b, a·b, |b| y la proyección de a sobre b (10 decimales)
 * Complejidad: tiempo O(1) por operación, memoria O(1)
"""


# vector en 3D (para vectores en el plano se fija z = 0)
class Point3d:
    def __init__(self, x, y, z):
        self.x, self.y, self.z = x, y, z

    def __add__(self, t):
        return Point3d(self.x + t.x, self.y + t.y, self.z + t.z)

    def __sub__(self, t):
        return Point3d(self.x - t.x, self.y - t.y, self.z - t.z)

    def __mul__(self, t):
        return Point3d(self.x * t, self.y * t, self.z * t)

    def __truediv__(self, t):
        return Point3d(self.x / t, self.y / t, self.z / t)

    # igualdad con tolerancia EPS por ser reales
    def __eq__(self, o):
        EPS = 1e-6
        return abs(self.x - o.x) < EPS and abs(self.y - o.y) < EPS and abs(self.z - o.z) < EPS


# producto punto
def dot(a, b):
    return a.x * b.x + a.y * b.y + a.z * b.z


# producto cruz
def cross(a, b):
    return Point3d(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x)


# norma al cuadrado y norma
def norm(a):
    return dot(a, a)


def length(a):
    return math.sqrt(norm(a))


# proyección de a sobre b: b * (a·b / |b|²)
def proj(a, b):
    return b * (dot(a, b) / norm(b))


# ángulo entre dos vectores
def angle(a, b):
    return math.acos(dot(a, b) / length(a) / length(b))


def main():
    ax, ay, az, bx, by, bz = map(float, sys.stdin.read().split()[:6])
    A, B = Point3d(ax, ay, az), Point3d(bx, by, bz)
    f = lambda v: "%.10f" % v
    s, d, cr, pr = A + B, A - B, cross(A, B), proj(A, B)
    print("A+B =", f(s.x), f(s.y), f(s.z))
    print("A-B =", f(d.x), f(d.y), f(d.z))
    print("AxB =", f(cr.x), f(cr.y), f(cr.z))
    print("A.B =", f(dot(A, B)))
    print("|B| =", f(length(B)))
    print("proj_B(A) =", f(pr.x), f(pr.y), f(pr.z))


main()
