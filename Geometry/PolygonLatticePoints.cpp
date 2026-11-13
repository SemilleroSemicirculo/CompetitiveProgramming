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
 * Algoritmo : Teorema de Pick (puntos enteros de un polígono)
 * Problema  : CSES 2193 - Polygon Lattice Points (https://cses.fi/problemset/task/2193)
 * Entrada   : n, luego n vértices enteros en orden
 * Salida    : puntos enteros interiores y puntos enteros en el borde
 * Complejidad: tiempo O(n log C), memoria O(n)
 */

int main() {
    fastio;
    int n;
    cin >> n;
    vector<pair<ll, ll>> p(n);
    for (auto &q : p) cin >> q.first >> q.second;

    ll area2 = 0, boundary = 0;  // area2 = 2 * área
    for (int i = 0; i < n; i++) {
        auto [x1, y1] = p[i];
        auto [x2, y2] = p[(i + 1) % n];
        area2 += x1 * y2 - x2 * y1;
        boundary += gcd(abs(x2 - x1), abs(y2 - y1));
    }
    area2 = abs(area2);

    // Pick: A = I + B/2 - 1  =>  I = (2A - B + 2) / 2
    ll inside = (area2 - boundary + 2) / 2;
    cout << inside << ' ' << boundary << "\n";
    return 0;
}
