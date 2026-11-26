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
 * Algoritmo : Suma de Minkowski de polígonos convexos (mezclar las aristas por ángulo) + punto en polígono convexo en O(log n)
 * Problema  : Codeforces 87E - Mogohu-Rea Idol (https://codeforces.com/problemset/problem/87/E)
 * Entrada   : tres polígonos convexos (cada uno: n y n vértices "x y" en sentido antihorario, sin tres colineales);
 *             m y m puntos "x y"
 * Salida    : para cada punto h, YES si existen a, b, c (uno en cada polígono, bordes incluidos) con a + b + c = 3h; si no, NO
 * Complejidad: tiempo O(n_1 + n_2 + n_3 + m log n), memoria O(n_1 + n_2 + n_3)
 */

typedef __int128 L;
struct P {
    ll x, y;
    P operator+(P o) const { return {x + o.x, y + o.y}; }
    P operator-(P o) const { return {x - o.x, y - o.y}; }
};
L cross(P a, P b) { return (L)a.x * b.y - (L)a.y * b.x; }

// rotar el polígono para que empiece en el vértice más bajo (y luego más a la izquierda)
void normalizar(vector<P> &p) {
    int k = 0;
    for (int i = 1; i < (int)p.size(); i++) if (p[i].y < p[k].y || (p[i].y == p[k].y && p[i].x < p[k].x)) k = i;
    rotate(p.begin(), p.begin() + k, p.end());
}
// Las aristas de A + B son las de A y las de B ordenadas por ángulo: como ambas listas ya están
// ordenadas (empiezan en el punto más bajo), basta mezclarlas como en merge sort.
vector<P> minkowski(vector<P> a, vector<P> b) {
    normalizar(a); normalizar(b);
    int n = a.size(), m = b.size();
    a.push_back(a[0]); a.push_back(a[1]); b.push_back(b[0]); b.push_back(b[1]);
    vector<P> res;
    int i = 0, j = 0;
    while (i < n || j < m) {
        res.push_back(a[i] + b[j]);
        L c = cross(a[i + 1] - a[i], b[j + 1] - b[j]);
        if (j >= m || (i < n && c > 0)) i++;
        else if (i >= n || c < 0) j++;
        else i++, j++;   // aristas paralelas: avanzan juntas
    }
    return res;
}
// punto en polígono convexo (antihorario, sin colineales consecutivos): búsqueda binaria del abanico desde p[0]
bool dentro(const vector<P> &p, P q) {
    int n = p.size();
    if (n == 1) return q.x == p[0].x && q.y == p[0].y;
    if (n == 2) return cross(p[1] - p[0], q - p[0]) == 0 &&
                       min(p[0].x, p[1].x) <= q.x && q.x <= max(p[0].x, p[1].x) &&
                       min(p[0].y, p[1].y) <= q.y && q.y <= max(p[0].y, p[1].y);
    if (cross(p[1] - p[0], q - p[0]) < 0 || cross(p[n - 1] - p[0], q - p[0]) > 0) return false;
    int lo = 1, hi = n - 1;   // el triángulo (p0, p[lo], p[lo+1]) que contiene la dirección de q
    while (hi - lo > 1) {
        int mid = (lo + hi) / 2;
        if (cross(p[mid] - p[0], q - p[0]) >= 0) lo = mid; else hi = mid;
    }
    return cross(p[lo + 1] - p[lo], q - p[lo]) >= 0;
}

int main() {
    fastio;
    vector<vector<P>> pol(3);
    for (auto &p : pol) {
        int n;
        cin >> n;
        p.resize(n);
        for (auto &v : p) cin >> v.x >> v.y;
    }
    vector<P> s = minkowski(minkowski(pol[0], pol[1]), pol[2]);
    // quitar vértices colineales que pudieran quedar (aristas paralelas consecutivas)
    vector<P> t;
    for (int i = 0; i < (int)s.size(); i++) {
        P a = s[(i + s.size() - 1) % s.size()], b = s[i], c = s[(i + 1) % s.size()];
        if (cross(b - a, c - b) != 0) t.push_back(b);
    }
    if (t.empty()) t = s;
    normalizar(t);
    int m;
    cin >> m;
    while (m--) {
        P h;
        cin >> h.x >> h.y;
        cout << (dentro(t, {3 * h.x, 3 * h.y}) ? "YES" : "NO") << "\n";
    }
    return 0;
}
