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
 * Algoritmo : Intersección de dos rectas con producto cruz (forma paramétrica)
 * Problema  : Problema propio: rectas dadas por dos puntos cada una (|coord| ≤ 10^4)
 * Entrada   : T casos; cada uno x1 y1 x2 y2 x3 y3 x4 y4 (recta por P1, P2 y recta por P3, P4)
 * Salida    : "POINT x y" con 6 decimales, "PARALLEL" si no se cortan o "SAME" si son la misma recta
 * Complejidad: tiempo O(1) por caso, memoria O(1)
 */

struct P { ll x, y; };
P operator-(P a, P b) { return {a.x - b.x, a.y - b.y}; }
ll cross(P a, P b) { return a.x * b.y - a.y * b.x; }

int main() {
    fastio;
    int T;
    cin >> T;
    precision(6);
    while (T--) {
        P a, b, c, d;
        cin >> a.x >> a.y >> b.x >> b.y >> c.x >> c.y >> d.x >> d.y;
        P r = b - a, s = d - c;
        ll den = cross(r, s);                     // 0 si las direcciones son paralelas
        if (den == 0) {
            cout << (cross(r, c - a) == 0 ? "SAME" : "PARALLEL") << "\n";
            continue;
        }
        // a + t·r = c + u·s  →  cruzando con s: t = cross(c − a, s) / cross(r, s)
        double t = (double)cross(c - a, s) / den;
        double x = a.x + t * r.x, y = a.y + t * r.y;
        if (fabs(x) < 5e-7) x = 0;   // evita imprimir "-0.000000"
        if (fabs(y) < 5e-7) y = 0;
        cout << "POINT " << x << " " << y << "\n";
    }
    return 0;
}
