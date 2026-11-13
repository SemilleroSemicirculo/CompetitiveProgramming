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
 * Algoritmo : Fórmula del Shoelace (área de un polígono)
 * Problema  : CSES 2191 - Polygon Area (https://cses.fi/problemset/task/2191)
 * Entrada   : n, luego n vértices "x y" en orden
 * Salida    : el doble del área del polígono (entero)
 * Complejidad: tiempo O(n), memoria O(n)
 */

// módulo no negativo para índices circulares
ll mod(ll x, ll n) {
    return (x % n + n) % n;
}

int main() {
    fastio;
    ll n;
    cin >> n;
    vector<pair<ll, ll>> points(n);
    for (auto &p : points) cin >> p.first >> p.second;

    ll res = 0;
    for (int i = 0; i < n; i++) {
        // término x_i * (y_{i+1} - y_{i-1}) de la fórmula del Shoelace
        res += points[i].first * (points[mod(i + 1, n)].second - points[mod(i - 1, n)].second);
    }

    res = abs(res);  // Esto me da 2 veces el area!!
    cout << res << "\n";
    return 0;
}
