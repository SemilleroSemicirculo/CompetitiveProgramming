#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef long double ld;
const ll INF = numeric_limits<ll>::max();

#define all(x) x.begin(), x.end()
#define rall(x) x.rbegin(), x.rend()
#define MOD 998244353
#define pi acos(-1)
#define gcd __gcd
#define lcm(a, b) ((a) * (b) / gcd(a, b))
#define precision(n) cout << fixed << setprecision(n)
#define debug(arr) cerr << #arr << " = "; for (auto &x : arr) cerr << x << " "; cerr << endl;
#define fastio ios::sync_with_stdio(0); cin.tie(0); cout.tie(0);

/*
 * Algoritmo : Vectores 3D (suma, producto punto y cruz, norma, proyección, ángulo)
 * Problema  : Sin problema equivalente en CSES; formato propio
 * Entrada   : seis reales: ax ay az bx by bz (para vectores en el plano, z = 0)
 * Salida    : a+b, a-b, a×b, a·b, |b| y la proyección de a sobre b (10 decimales)
 * Complejidad: tiempo O(1) por operación, memoria O(1)
 */

struct Point3d {
	ld x, y, z; //Son vectores y si lo necesita en el plano, pues fije z=0
	Point3d() {}
	Point3d(ld x, ld y, ld z): x(x), y(y), z(z) {}
	Point3d& operator+=(const Point3d &t) {
		x += t.x;
		y += t.y;
		z += t.z;
		return *this;
	}
	Point3d& operator-=(const Point3d &t) {
		x -= t.x;
		y -= t.y;
		z -= t.z;
		return *this;
	}
	Point3d& operator*=(ld t) { //Aqui se opera a derecha!!
		x *= t;
		y *= t;
		z *= t;
		return *this;
	}
	Point3d& operator/=(ld t) { //Aqui se opera a derecha!!
		x /= t;
		y /= t;
		z /= t;
	return *this;
	}
	Point3d operator+(const Point3d &t) const {
		return Point3d(*this) += t;
	}
	Point3d operator-(const Point3d &t) const {
		return Point3d(*this) -= t;
	}
	Point3d operator*(ld t) const {
		return Point3d(*this) *= t;
	}
	Point3d operator/(ld t) const {
		return Point3d(*this) /= t;
	}
	// producto punto
	static ld dot(Point3d a,Point3d b) {
		return a.x * b.x + a.y * b.y + a.z * b.z;
	}
	// producto cruz
	static Point3d cross(Point3d a, Point3d b) {
		return Point3d(a.y * b.z - a.z * b.y,
			a.z * b.x - a.x * b.z,
			a.x * b.y - a.y * b.x);
	}
	static ld norm(Point3d a) {//norma al cuadrado
		return dot(a,a);
	}
	static ld abs(Point3d a) {//norma normal xd
		return sqrt(norm(a));
	}
	// proyección de a sobre b: b * (a·b / |b|²)
	static Point3d proj(Point3d a, Point3d b) {// proyeccion de a en b
		return b*(dot(a, b) / norm(b));
	}
	// ángulo entre dos vectores
	static ld angle(Point3d a, Point3d b) {
		return acos(dot(a, b) / abs(a) / abs(b));
	}
	// igualdad con tolerancia EPS por ser reales
	bool operator==(const Point3d &other) const {
    		const double EPS = 1e-6;
		return fabs(x - other.x) < EPS && fabs(y - other.y) < EPS && fabs(z - other.z) < EPS;
	}
};
Point3d operator*(ld a, Point3d b) {
	return b * a;
}

int main() {
    fastio;
    precision(10);
    ld ax, ay, az, bx, by, bz;
    cin >> ax >> ay >> az >> bx >> by >> bz;
    Point3d A(ax, ay, az), B(bx, by, bz);

    Point3d sum = A + B, diff = A - B, cr = Point3d::cross(A, B), pr = Point3d::proj(A, B);
    cout << "A+B = " << sum.x << ' ' << sum.y << ' ' << sum.z << "\n";
    cout << "A-B = " << diff.x << ' ' << diff.y << ' ' << diff.z << "\n";
    cout << "AxB = " << cr.x << ' ' << cr.y << ' ' << cr.z << "\n";
    cout << "A.B = " << Point3d::dot(A, B) << "\n";
    cout << "|B| = " << Point3d::abs(B) << "\n";
    cout << "proj_B(A) = " << pr.x << ' ' << pr.y << ' ' << pr.z << "\n";
    return 0;
}
