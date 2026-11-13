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
 * Algoritmo : Par de puntos más cercano (sweep line con set)
 * Problema  : CSES 2194 - Minimum Euclidean Distance (https://cses.fi/problemset/task/2194)
 * Entrada   : n, luego n puntos enteros "x y"
 * Salida    : el cuadrado de la mínima distancia euclidiana entre dos puntos
 * Complejidad: tiempo O(n log n), memoria O(n)
 */

int main() {
    fastio;
    int n;
    cin >> n;
    vector<pair<ll, ll>> p(n);
    for (auto &q : p) cin >> q.first >> q.second;
    // se ordenan los puntos por x
    sort(all(p));  // ordenados por x

    auto dist2 = [](pair<ll, ll> a, pair<ll, ll> b) {
        return (a.first - b.first) * (a.first - b.first) + (a.second - b.second) * (a.second - b.second);
    };

    // set ordenado por y con los puntos dentro de la franja de ancho sqrt(best)
    // puntos cercanos en x, ordenados por y
    set<pair<ll, ll>> active;  // {y, x}
    ll best = INF;
    int left = 0;
    for (int i = 0; i < n; i++) {
        ll d = (ll)ceil(sqrt((ld)best));
        if (best == INF) d = 4e9;
        // se sacan los puntos demasiado lejos en x
        while (left < i && p[i].first - p[left].first >= d) {
            active.erase({p[left].second, p[left].first});
            left++;
        }
        // solo se revisan los puntos con y dentro de ±d (pocos por la franja)
        auto lo = active.lower_bound({p[i].second - d, -INF});
        for (auto it = lo; it != active.end() && it->first <= p[i].second + d; ++it)
            best = min(best, dist2(p[i], {it->second, it->first}));
        active.insert({p[i].second, p[i].first});
    }
    cout << best << "\n";
    return 0;
}
