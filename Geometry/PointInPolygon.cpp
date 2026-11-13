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
 * Algoritmo : Punto en polígono (ray casting con producto cruz)
 * Problema  : CSES 2192 - Point in Polygon (https://cses.fi/problemset/task/2192)
 * Entrada   : n m, luego n vértices del polígono y m puntos "x y"
 * Salida    : INSIDE, OUTSIDE o BOUNDARY para cada punto
 * Complejidad: tiempo O(n · m), memoria O(n)
 */

typedef pair<ll, ll> pt;

// producto cruz (b - a) x (c - a)
ll cross(pt a, pt b, pt c) {  // (b - a) x (c - a)
    return (b.first - a.first) * (c.second - a.second) - (b.second - a.second) * (c.first - a.first);
}

// p está en el segmento ab: colineal y dentro de su caja
bool onSegment(pt a, pt b, pt p) {
    return cross(a, b, p) == 0 &&
           min(a.first, b.first) <= p.first && p.first <= max(a.first, b.first) &&
           min(a.second, b.second) <= p.second && p.second <= max(a.second, b.second);
}

int main() {
    fastio;
    int n, m;
    cin >> n >> m;
    vector<pt> poly(n);
    for (auto &p : poly) cin >> p.first >> p.second;

    while (m--) {
        pt p;
        cin >> p.first >> p.second;
        bool boundary = false;
        int crossings = 0;
        for (int i = 0; i < n; i++) {
            pt a = poly[i], b = poly[(i + 1) % n];
            // si está sobre una arista, es borde
            if (onSegment(a, b, p)) { boundary = true; break; }
            // rayo hacia la derecha: cuenta aristas que cruzan la altura de p
            // rayo horizontal: se cuentan aristas que cruzan la altura de p a su derecha
            if ((a.second > p.second) != (b.second > p.second)) {
                ll c = cross(a, b, p);
                if ((c > 0) == (b.second > a.second)) crossings++;
            }
        }
        if (boundary) cout << "BOUNDARY\n";
        // cantidad impar de cruces = adentro
        else cout << (crossings % 2 ? "INSIDE" : "OUTSIDE") << "\n";
    }
    return 0;
}
