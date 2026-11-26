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
 * Algoritmo : Intersección de semiplanos (ordenar por ángulo + deque), O(n log n)
 * Problema  : Problema propio: área común de n semiplanos dentro de la caja [−10^4, 10^4]²
 * Entrada   : n; luego n rectas dirigidas "x1 y1 x2 y2": se conserva el lado izquierdo de P1 → P2
 * Salida    : el área de la intersección, con 6 decimales (0 si es vacía)
 * Complejidad: tiempo O(n log n), memoria O(n)
 */

typedef long double D;
struct P { D x, y; };
P operator+(P a, P b) { return {a.x + b.x, a.y + b.y}; }
P operator-(P a, P b) { return {a.x - b.x, a.y - b.y}; }
P operator*(P a, D k) { return {a.x * k, a.y * k}; }
D cross(P a, P b) { return a.x * b.y - a.y * b.x; }

struct Recta {
    P p, d;           // punto y dirección; el semiplano es el lado izquierdo
    D ang;
    Recta(P a, P b) : p(a), d(b - a), ang(atan2l(b.y - a.y, b.x - a.x)) {}
    bool fuera(P q) const { return cross(d, q - p) < -1e-12; }   // q está a la derecha
};
P corte(const Recta &a, const Recta &b) {
    // a.p + t·a.d está sobre b  ⟺  cross(b.d, a.p + t·a.d − b.p) = 0
    D t = cross(b.d, b.p - a.p) / cross(b.d, a.d);
    return a.p + a.d * t;
}

int main() {
    fastio;
    int n;
    cin >> n;
    vector<Recta> H;
    const D B = 1e4;   // la caja hace que la intersección sea acotada
    H.push_back(Recta({-B, -B}, {B, -B}));
    H.push_back(Recta({B, -B}, {B, B}));
    H.push_back(Recta({B, B}, {-B, B}));
    H.push_back(Recta({-B, B}, {-B, -B}));
    for (int i = 0; i < n; i++) {
        D a, b, c, d;
        cin >> a >> b >> c >> d;
        H.push_back(Recta({a, b}, {c, d}));
    }
    // con el mismo ángulo solo importa la más restrictiva (la que deja menos a la izquierda)
    sort(all(H), [](const Recta &a, const Recta &b) {
        if (fabsl(a.ang - b.ang) > 1e-15) return a.ang < b.ang;
        return cross(a.d, b.p - a.p) > 0;   // b está a la izquierda de a: b es más restrictiva
    });
    vector<Recta> U;
    for (auto &h : H) if (U.empty() || fabsl(U.back().ang - h.ang) > 1e-15) U.push_back(h); else U.back() = h;
    // deque: rectas útiles en orden de ángulo; se saca de los extremos la que quedó tapada
    deque<Recta> dq;
    for (auto &h : U) {
        while (dq.size() >= 2 && h.fuera(corte(dq[dq.size() - 1], dq[dq.size() - 2]))) dq.pop_back();
        while (dq.size() >= 2 && h.fuera(corte(dq[0], dq[1]))) dq.pop_front();
        if (!dq.empty() && fabsl(cross(dq.back().d, h.d)) < 1e-18) {   // paralela opuesta
            if (cross(dq.back().d, h.p - dq.back().p) <= 0) { cout << "0.000000\n"; return 0; }
        }
        dq.push_back(h);
    }
    while (dq.size() >= 3 && dq[0].fuera(corte(dq[dq.size() - 1], dq[dq.size() - 2]))) dq.pop_back();
    while (dq.size() >= 3 && dq.back().fuera(corte(dq[0], dq[1]))) dq.pop_front();
    if (dq.size() < 3) { cout << "0.000000\n"; return 0; }
    vector<P> poly;
    for (size_t i = 0; i < dq.size(); i++) poly.push_back(corte(dq[i], dq[(i + 1) % dq.size()]));
    D area = 0;
    for (size_t i = 0; i < poly.size(); i++) area += cross(poly[i], poly[(i + 1) % poly.size()]);
    precision(6);
    cout << (double)max((D)0, area / 2) << "\n";
    return 0;
}
