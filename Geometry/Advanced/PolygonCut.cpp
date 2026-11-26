#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef long double ld;
const ll INF = numeric_limits<ll>::max() / 4;   // deja margen para INF + w sin desbordar

#define all(x) x.begin(), x.end()
#define rall(x) x.rbegin(), x.rend()
#define MOD 998244353
#define pi acos(-1)
#define gcd __gcd
inline ll lcm(ll a, ll b) { return a / __gcd(a, b) * b; }   // divide antes de multiplicar
#define precision(n) cout << fixed << setprecision(n)
#define debug(arr) do { cerr << #arr << " = "; for (auto &x : arr) cerr << x << " "; cerr << endl; } while (0)
#define fastio ios::sync_with_stdio(0); cin.tie(0); cout.tie(0);
/*
 * Algoritmo : Corte de un polígono convexo por una recta (Sutherland-Hodgman con un solo semiplano)
 * Problema  : Problema propio: polígono convexo y q rectas de corte (|coord| ≤ 10^4)
 * Entrada   : n y los n vértices en sentido antihorario; q; luego q rectas "x1 y1 x2 y2"
 * Salida    : para cada recta, el área de la parte del polígono a su izquierda (6 decimales)
 * Complejidad: tiempo O(n) por recta, memoria O(n)
 */

struct P { double x, y; };
P operator+(P a, P b) { return {a.x + b.x, a.y + b.y}; }
P operator-(P a, P b) { return {a.x - b.x, a.y - b.y}; }
P operator*(P a, double k) { return {a.x * k, a.y * k}; }
double cross(P a, P b) { return a.x * b.y - a.y * b.x; }

// se recorren las aristas del polígono; se conservan los vértices del lado izquierdo y se
// agrega el punto de cruce cada vez que una arista atraviesa la recta
vector<P> cortar(const vector<P> &poly, P a, P b) {
    vector<P> res;
    int n = poly.size();
    for (int i = 0; i < n; i++) {
        P c = poly[i], d = poly[(i + 1) % n];
        double sc = cross(b - a, c - a), sd = cross(b - a, d - a);   // de qué lado está cada uno
        if (sc >= 0) res.push_back(c);
        if ((sc > 0 && sd < 0) || (sc < 0 && sd > 0))
            res.push_back(c + (d - c) * (sc / (sc - sd)));            // cruce por proporción
    }
    return res;
}

double area(const vector<P> &p) {
    double s = 0;
    for (size_t i = 0; i < p.size(); i++) s += cross(p[i], p[(i + 1) % p.size()]);
    return fabs(s) / 2;
}

int main() {
    fastio;
    int n, q;
    cin >> n;
    vector<P> poly(n);
    for (auto &p : poly) cin >> p.x >> p.y;
    cin >> q;
    precision(6);
    while (q--) {
        P a, b;
        cin >> a.x >> a.y >> b.x >> b.y;
        cout << area(cortar(poly, a, b)) << "\n";
    }
    return 0;
}
