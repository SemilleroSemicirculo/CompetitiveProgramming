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
 * Algoritmo : Distancia punto-segmento y distancia entre dos segmentos
 * Problema  : Kattis - Segment Distance (https://open.kattis.com/problems/segmentdistance)
 * Entrada   : n casos; cada uno x1 y1 x2 y2 x3 y3 x4 y4 (segmentos P1P2 y P3P4, |coord| ≤ 10^4)
 * Salida    : la distancia mínima entre los dos segmentos, con 2 decimales
 * Complejidad: tiempo O(1) por caso, memoria O(1)
 */

struct P { ll x, y; };
P operator-(P a, P b) { return {a.x - b.x, a.y - b.y}; }
ll cross(P a, P b) { return a.x * b.y - a.y * b.x; }
ll dot(P a, P b) { return a.x * b.x + a.y * b.y; }
int orient(P a, P b, P c) { ll v = cross(b - a, c - a); return (v > 0) - (v < 0); }

// ¿c está en el segmento ab, sabiendo que es colineal?
bool enCaja(P a, P b, P c) {
    return min(a.x, b.x) <= c.x && c.x <= max(a.x, b.x) && min(a.y, b.y) <= c.y && c.y <= max(a.y, b.y);
}
bool seCortan(P a, P b, P c, P d) {
    int o1 = orient(a, b, c), o2 = orient(a, b, d), o3 = orient(c, d, a), o4 = orient(c, d, b);
    if (o1 * o2 < 0 && o3 * o4 < 0) return true;           // cruce propio
    return (o1 == 0 && enCaja(a, b, c)) || (o2 == 0 && enCaja(a, b, d)) ||
           (o3 == 0 && enCaja(c, d, a)) || (o4 == 0 && enCaja(c, d, b));
}

// distancia del punto p al segmento ab: si la proyección cae fuera, el más cercano es un extremo
double distPS(P p, P a, P b) {
    P ab = b - a, ap = p - a;
    ll L = dot(ab, ab);
    if (L == 0) return hypot(ap.x, ap.y);                  // segmento degenerado (un punto)
    ll t = dot(ap, ab);                                    // proyección sin dividir: t/L ∈ [0, 1]
    if (t <= 0) return hypot(ap.x, ap.y);
    if (t >= L) { P bp = p - b; return hypot(bp.x, bp.y); }
    return fabs((double)cross(ab, ap)) / sqrt((double)L);  // altura = |cruz| / base
}

int main() {
    fastio;
    int n;
    cin >> n;
    precision(2);
    while (n--) {
        P a, b, c, d;
        cin >> a.x >> a.y >> b.x >> b.y >> c.x >> c.y >> d.x >> d.y;
        // si se cortan, 0; si no, el mínimo siempre se alcanza en algún extremo
        double r = seCortan(a, b, c, d) ? 0 : min({distPS(a, c, d), distPS(b, c, d), distPS(c, a, b), distPS(d, a, b)});
        cout << r + 1e-12 << "\n";
    }
    return 0;
}
