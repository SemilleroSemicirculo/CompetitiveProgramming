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
 * Algoritmo : Prim (árbol de expansión mínima con cola de prioridad)
 * Problema  : CSES 1675 - Road Reparation (https://cses.fi/problemset/task/1675)
 * Entrada   : n m, luego m aristas "a b c" (costo c)
 * Salida    : el costo mínimo para conectar todo, o IMPOSSIBLE
 * Complejidad: tiempo O(m log n), memoria O(n + m)
 */

int main() {
    fastio;
    int n, m;
    cin >> n >> m;
    vector<vector<pair<int, ll>>> G(n + 1);
    for (int i = 0; i < m; i++) {
        int a, b;
        ll c;
        cin >> a >> b >> c;
        G[a].push_back({b, c});
        G[b].push_back({a, c});
    }

    vector<bool> inTree(n + 1, false);
    priority_queue<pair<ll, int>, vector<pair<ll, int>>, greater<pair<ll, int>>> pq;
    pq.push({0, 1});
    ll total = 0;
    int used = 0;
    while (!pq.empty()) {
        auto [w, u] = pq.top();
        pq.pop();
        if (inTree[u]) continue;
        inTree[u] = true;
        total += w;
        used++;
        for (auto [v, c] : G[u])
            if (!inTree[v]) pq.push({c, v});
    }

    if (used != n) cout << "IMPOSSIBLE\n";
    else cout << total << "\n";
    return 0;
}
