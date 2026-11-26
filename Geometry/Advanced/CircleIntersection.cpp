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
 * Algoritmo : Intersección de dos circunferencias (casos exactos con enteros, puntos con flotantes)
 * Problema  : Problema propio: dos circunferencias con centro y radio enteros (|coord|, r ≤ 10^4)
 * Entrada   : T casos; cada uno x1 y1 r1 x2 y2 r2
 * Salida    : "INFINITE" si son la misma; si no, k (0, 1 o 2) y los k puntos ordenados, con 6 decimales
 * Complejidad: tiempo O(1) por caso, memoria O(1)
 */

int main() {
    fastio;
    int T;
    cin >> T;
    precision(6);
    while (T--) {
        ll x1, y1, r1, x2, y2, r2;
        cin >> x1 >> y1 >> r1 >> x2 >> y2 >> r2;
        ll dx = x2 - x1, dy = y2 - y1, d2 = dx * dx + dy * dy;
        // la cantidad de puntos se decide con enteros: comparar d² con (r1 ± r2)²
        if (d2 == 0) {
            if (r1 == r2) cout << "INFINITE\n"; else cout << "0\n";   // concéntricas
            continue;
        }
        ll suma = (r1 + r2) * (r1 + r2), dif = (r1 - r2) * (r1 - r2);
        if (d2 > suma || d2 < dif) { cout << "0\n"; continue; }   // separadas o una dentro de otra
        double d = sqrt((double)d2);
        // a = distancia del centro 1 al punto medio de la cuerda (sale de restar las ecuaciones)
        double a = (double)(r1 * r1 - r2 * r2 + d2) / (2 * d);
        double h = (d2 == suma || d2 == dif) ? 0 : sqrt(max(0.0, (double)r1 * r1 - a * a));
        double mx = x1 + a * dx / d, my = y1 + a * dy / d;        // punto medio de la cuerda
        vector<pair<double, double>> pts = {{mx - h * dy / d, my + h * dx / d}};
        if (h > 0) pts.push_back({mx + h * dy / d, my - h * dx / d});
        sort(all(pts));
        cout << pts.size();
        for (auto [x, y] : pts) cout << " " << (fabs(x) < 5e-7 ? 0.0 : x) << " " << (fabs(y) < 5e-7 ? 0.0 : y);
        cout << "\n";
    }
    return 0;
}
