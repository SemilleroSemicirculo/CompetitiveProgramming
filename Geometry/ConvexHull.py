def orientation(a, b, c):
    v = a[0] * (b[1] - c[1]) + b[0] * (c[1] - a[1]) + c[0] * (a[1] - b[1])
    if v < 0:
        return -1   # antihorario
    if v > 0:
        return 1    # horario
    return 0        # colineales

def cw(a, b, c, include_collinear):
    o = orientation(a, b, c)
    return o < 0 or (include_collinear and o == 0)

def collinear(a, b, c):
    return orientation(a, b, c) == 0

def convex_hull(points, include_collinear=False):
    # Encontrar el punto más abajo a la izquierda
    p0 = min(points, key=lambda p: (p[1], p[0]))

    # Ordenar por ángulo polar respecto a p0
    def cmp(a, b):
        o = orientation(p0, a, b)
        if o == 0:
            # si son colineales, el más cercano primero
            da = (p0[0] - a[0]) ** 2 + (p0[1] - a[1]) ** 2
            db = (p0[0] - b[0]) ** 2 + (p0[1] - b[1]) ** 2
            return da - db
        return -1 if o < 0 else 1

    # Python no tiene cmp directo en sort, así que usamos cmp_to_key
    from functools import cmp_to_key
    points.sort(key=cmp_to_key(cmp))

    if include_collinear:
        i = len(points) - 1
        while i >= 0 and collinear(p0, points[i], points[-1]):
            i -= 1
        points[i + 1 :] = reversed(points[i + 1 :])

    st = []
    for p in points:
        while len(st) > 1 and not cw(st[-2], st[-1], p, include_collinear):
            st.pop()
        st.append(p)

    if not include_collinear and len(st) == 2 and st[0] == st[1]:
        st.pop()

    return st


# Ejemplo de uso
points = [(0, 0), (2, 0), (1, 1), (2, 2), (0, 2)]
hull = convex_hull(points, include_collinear=False)

for x, y in hull:
    print(x, y)
