#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef long double ld;
const ll INF = numeric_limits<ll>::max();

#define all(x) x.begin(), x.end()
#define rall(x) x.rbegin(), x.rend()
#define MOD 998244353
// #define MOD pow(10, 9)+7;
// #define MOD 3245284303;
#define pi acos(-1)
#define gcd __gcd
#define lcm(a, b) ((a) * (b) / gcd(a, b))
#define precision(n) cout << fixed << setprecision(n)
#define debug(arr) cerr << #arr << " = "; for (auto &x : arr) cerr << x << " "; cerr << endl;
#define fastio ios::sync_with_stdio(0); cin.tie(0); cout.tie(0);

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
	static ld dot(Point3d a,Point3d b) {
		return a.x * b.x + a.y * b.y + a.z * b.z;
	}
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
	static Point3d proj(Point3d a, Point3d b) {// proyeccion de a en b
		return b*(dot(a, b) / abs(b));
	}
	static ld angle(Point3d a, Point3d b) {
		return acos(dot(a, b) / abs(a) / abs(b));
	}
	bool operator==(const Point3d &other) const {
    		const double EPS = 1e-6;
		return fabs(x - other.x) < EPS && fabs(y - other.y) < EPS;
	}
};
Point3d operator*(ld a, Point3d b) {
	return b * a;
}




int main(){
	precision(10);
	ld t = 0.5;
	Point3d OA(3,1,4.5), OB(3,4,0);
	cout << "OA+OB = " << (OA+OB).x << " " <<(OA+OB).y << (OA+OB).z<< endl;
	cout << "OA-OB = " << (OA-OB).x << " " <<(OA-OB).y << (OA-OB).z<<endl;
	cout << "tOB = " << (OB*t).x << " " << (OB*t).y << (OB*t).z << endl;
	cout << "(1/t)OB = " << (OB/t).x << " " << (OB/t).y << (OB/t).z << endl;
	cout << "OAxOB = " << Point3d::cross(OA,OB).x << " " << Point3d::cross(OA,OB).y << " " << Point3d::cross(OA,OB).z << endl;
	cout << "OA*OB = " << Point3d::dot(OA,OB) << endl;
	cout << "||OB|| = " << Point3d::abs(OB) << endl;
	cout << "Proyeccion de OA sobre OB " << Point3d::proj(OA,OB).x << " " << Point3d::proj(OA,OB).y << " " << Point3d::proj(OA,OB).z << endl;
}