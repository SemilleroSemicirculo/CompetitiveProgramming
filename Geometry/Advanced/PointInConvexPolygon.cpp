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
 * Algoritmo : Punto dentro de un polígono convexo en O(log n) (búsqueda binaria por ángulo)
 * Problema  : Codeforces 166B - Polygons (https://codeforces.com/problemset/problem/166/B)
 * Entrada   : n y el polígono A estrictamente convexo (sentido horario); m y el polígono B
 * Salida    : YES si todos los vértices de B están estrictamente dentro de A; si no, NO
 * Complejidad: tiempo O(n + m log n), memoria O(n)
 */

struct P { ll x, y; };
P operator-(P a, P b) { return {a.x - b.x, a.y - b.y}; }
ll cross(P a, P b) { return a.x * b.y - a.y * b.x; }

int n;
vector<P> A;   // en sentido antihorario, A[0] es el pivote

bool dentroEstricto(P p) {
    // fuera del abanico A[1] … A[n−1] visto desde A[0] (o sobre sus bordes): no está dentro
    if (cross(A[1] - A[0], p - A[0]) <= 0) return false;
    if (cross(A[n - 1] - A[0], p - A[0]) >= 0) return false;
    // búsqueda binaria: el triángulo A[0], A[k], A[k+1] cuyo ángulo contiene a p
    int lo = 1, hi = n - 1;
    while (hi - lo > 1) {
        int mid = (lo + hi) / 2;
        if (cross(A[mid] - A[0], p - A[0]) > 0) lo = mid; else hi = mid;
    }
    // dentro del abanico; falta ver que esté estrictamente antes de la arista A[k] → A[k+1]
    return cross(A[lo + 1] - A[lo], p - A[lo]) > 0;
}

int main() {
    fastio;
    cin >> n;
    A.resize(n);
    for (auto &p : A) cin >> p.x >> p.y;
    reverse(all(A));   // viene en sentido horario; se pasa a antihorario
    int m;
    cin >> m;
    bool ok = true;
    for (int i = 0; i < m; i++) {
        P p;
        cin >> p.x >> p.y;
        if (!dentroEstricto(p)) ok = false;   // un polígono está dentro de un convexo
    }                                          // si y solo si todos sus vértices lo están
    cout << (ok ? "YES" : "NO") << "\n";
    return 0;
}
