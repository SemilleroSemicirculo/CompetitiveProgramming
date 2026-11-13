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
 * Algoritmo : Sweep line (eventos ordenados)
 * Problema  : CSES 1619 - Restaurant Customers (https://cses.fi/problemset/task/1619)
 * Entrada   : n, luego n pares "llegada salida"
 * Salida    : máxima cantidad de clientes simultáneos
 * Complejidad: tiempo O(n log n), memoria O(n)
 */

int main() {
    fastio;
    int n;
    cin >> n;
    // eventos: +1 al llegar y -1 al salir
    vector<pair<int, int>> events;  // {tiempo, +1 llega / -1 sale}
    for (int i = 0; i < n; i++) {
        int a, b;
        cin >> a >> b;
        events.push_back({a, 1});
        events.push_back({b, -1});
    }
    // a igual tiempo, las salidas (-1) van antes que las llegadas
    sort(all(events));

    int cur = 0, best = 0;
    for (auto [t, d] : events) {
        // cur = clientes presentes en este momento
        cur += d;
        best = max(best, cur);
    }
    cout << best << "\n";
    return 0;
}
