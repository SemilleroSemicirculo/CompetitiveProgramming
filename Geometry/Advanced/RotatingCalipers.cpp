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
 * Algoritmo : Rotating calipers sobre la envolvente convexa (par de puntos más lejano)
 * Problema  : Kattis - Robert Hood (https://open.kattis.com/problems/roberthood)
 * Entrada   : C; luego C puntos enteros x y
 * Salida    : la mayor distancia entre dos de los puntos
 * Complejidad: tiempo O(C log C) por la envolvente; los calibradores son O(h), memoria O(C)
 */

struct P { ll x, y; };
P operator-(P a, P b) { return {a.x - b.x, a.y - b.y}; }
ll cross(P a, P b) { return a.x * b.y - a.y * b.x; }
ll d2(P a, P b) { P d = a - b; return d.x * d.x + d.y * d.y; }

// cadena monótona: envolvente en sentido antihorario, sin puntos colineales
vector<P> hull(vector<P> p) {
    sort(all(p), [](P a, P b) { return make_pair(a.x, a.y) < make_pair(b.x, b.y); });
    p.erase(unique(all(p), [](P a, P b) { return a.x == b.x && a.y == b.y; }), p.end());
    if (p.size() < 3) return p;
    vector<P> abajo, arriba;
    for (P q : p) {                       // cadena de abajo, de izquierda a derecha
        while (abajo.size() >= 2 && cross(abajo.back() - abajo[abajo.size() - 2], q - abajo[abajo.size() - 2]) <= 0) abajo.pop_back();
        abajo.push_back(q);
    }
    for (int i = (int)p.size() - 1; i >= 0; i--) {   // cadena de arriba, de derecha a izquierda
        P q = p[i];
        while (arriba.size() >= 2 && cross(arriba.back() - arriba[arriba.size() - 2], q - arriba[arriba.size() - 2]) <= 0) arriba.pop_back();
        arriba.push_back(q);
    }
    abajo.pop_back(); arriba.pop_back();  // los extremos aparecen en las dos cadenas
    abajo.insert(abajo.end(), all(arriba));
    return abajo;
}

int main() {
    fastio;
    int C;
    cin >> C;
    vector<P> p(C);
    for (auto &q : p) cin >> q.x >> q.y;
    vector<P> h = hull(p);
    int n = h.size();
    ll best = 0;
    if (n <= 2) best = n == 2 ? d2(h[0], h[1]) : 0;
    else {
        // para cada arista i → i+1, el punto j más lejano de esa recta (antípoda) solo avanza:
        // cuando la arista gira, su antípoda también gira en el mismo sentido
        for (int i = 0, j = 1; i < n; i++) {
            P e = h[(i + 1) % n] - h[i];
            while (cross(e, h[(j + 1) % n] - h[i]) > cross(e, h[j] - h[i])) j = (j + 1) % n;
            best = max({best, d2(h[i], h[j]), d2(h[(i + 1) % n], h[j])});
        }
    }
    precision(8);
    cout << sqrt((long double)best) << "\n";
    return 0;
}
