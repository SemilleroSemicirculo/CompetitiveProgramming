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
 * Algoritmo : Intersección de segmentos (orientaciones y cajas envolventes)
 * Problema  : CSES 2190 - Line Segment Intersection (https://cses.fi/problemset/task/2190)
 * Entrada   : t casos con "x1 y1 x2 y2 x3 y3 x4 y4"
 * Salida    : YES si los segmentos se intersectan (incluye tocarse), NO si no
 * Complejidad: tiempo O(1) por caso, memoria O(1)
 */

typedef pair<ll, ll> pt;

int sgn(ll v) { return (v > 0) - (v < 0); }

// signo del producto cruz: 1 antihorario, -1 horario, 0 colineal
int orient(pt a, pt b, pt c) {
    return sgn((b.first - a.first) * (c.second - a.second) - (b.second - a.second) * (c.first - a.first));
}

// los rectángulos de los segmentos deben solaparse (caso colineal)
bool inBox(pt a, pt b, pt c, pt d) {  // las cajas de ab y cd se solapan
    return max(min(a.first, b.first), min(c.first, d.first)) <= min(max(a.first, b.first), max(c.first, d.first)) &&
           max(min(a.second, b.second), min(c.second, d.second)) <= min(max(a.second, b.second), max(c.second, d.second));
}

// los extremos de cada segmento quedan a lados opuestos del otro (o tocan)
bool intersect(pt a, pt b, pt c, pt d) {
    return inBox(a, b, c, d) &&
           orient(a, b, c) * orient(a, b, d) <= 0 &&
           orient(c, d, a) * orient(c, d, b) <= 0;
}

int main() {
    fastio;
    int t;
    cin >> t;
    while (t--) {
        pt a, b, c, d;
        cin >> a.first >> a.second >> b.first >> b.second >> c.first >> c.second >> d.first >> d.second;
        cout << (intersect(a, b, c, d) ? "YES" : "NO") << "\n";
    }
    return 0;
}
