from decimal import Decimal, getcontext
from math import sqrt, acos

# Ajustar precisión
getcontext().prec = 30

class Point3d:
    def __init__(self, x=Decimal(0), y=Decimal(0), z=Decimal(0)):
        self.x = Decimal(x)
        self.y = Decimal(y)
        self.z = Decimal(z)

    # Operadores
    def __add__(self, other): # Suma de vectores
        return Point3d(self.x + other.x, self.y + other.y, self.z + other.z)

    def __sub__(self, other): # Resta de vectores
        return Point3d(self.x - other.x, self.y - other.y, self.z - other.z)

    def __mul__(self, t): #Mult por escalar (Aca toca por derecha)
        if isinstance(t, (int, float, Decimal)):
            return Point3d(self.x * Decimal(t), self.y * Decimal(t), self.z * Decimal(t))
        raise TypeError("Multiplicación no soportada")

    def __rmul__(self, t): 
        return self.__mul__(t)

    def __truediv__(self, t):
        return Point3d(self.x / Decimal(t), self.y / Decimal(t), self.z / Decimal(t))

    def __eq__(self, other):
        EPS = Decimal("1e-6")
        return abs(self.x - other.x) < EPS and abs(self.y - other.y) < EPS and abs(self.z - other.z) < EPS

    # Métodos estáticos
    @staticmethod
    def dot(a, b):
        return a.x * b.x + a.y * b.y + a.z * b.z

    @staticmethod
    def cross(a, b):
        return Point3d(
            a.y * b.z - a.z * b.y,
            a.z * b.x - a.x * b.z,
            a.x * b.y - a.y * b.x
        )

    @staticmethod
    def norm(a):
        return Point3d.dot(a, a)

    @staticmethod
    def abs(a):
        return Decimal(sqrt(float(Point3d.norm(a))))  # sqrt no soporta Decimal directamente

    @staticmethod
    def proj(a, b):
        return b * (Point3d.dot(a, b) / Point3d.abs(b))

    @staticmethod
    def angle(a, b):
        return Decimal(acos(float(Point3d.dot(a, b) / (Point3d.abs(a) * Point3d.abs(b)))))


t = Decimal("0.5")
OA = Point3d(3, 1, 4.5)
OB = Point3d(3, 4, 0)

print("OA+OB =", (OA+OB).x, (OA+OB).y, (OA+OB).z)
print("OA-OB =", (OA-OB).x, (OA-OB).y, (OA-OB).z)
print("tOB =", (OB*t).x, (OB*t).y, (OB*t).z)
print("(1/t)OB =", (OB/t).x, (OB/t).y, (OB/t).z)
cross = Point3d.cross(OA, OB)
print("OAxOB =", cross.x, cross.y, cross.z)
print("OA*OB =", Point3d.dot(OA, OB))
print("||OB|| =", Point3d.abs(OB))
proj = Point3d.proj(OA, OB)
print("Proyeccion de OA sobre OB =", proj.x, proj.y, proj.z)
print("OA = OB", OA == OB)