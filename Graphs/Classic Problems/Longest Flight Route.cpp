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
 * Algoritmo : DP sobre un DAG en orden topológico (camino más largo)
 * Problema  : CSES 1680 - Longest Flight Route (https://cses.fi/problemset/task/1680)
 * Entrada   : n m, luego m vuelos dirigidos "a b" (no hay ciclos)
 * Salida    : la mayor cantidad de ciudades en una ruta de 1 a n y la ruta; o IMPOSSIBLE
 * Complejidad: tiempo O(n + m), memoria O(n + m)
 */

int main() {
    fastio;
    int n, m;
    cin >> n >> m;
    vector<vector<int>> g(n + 1);
    vector<int> indeg(n + 1, 0);
    for (int i = 0; i < m; i++) {
        int a, b;
        cin >> a >> b;
        g[a].push_back(b);
        indeg[b]++;
    }
    // orden topológico con Kahn: cada ciudad sale cuando ya se procesaron todas las que llegan a ella
    vector<int> order;
    queue<int> q;
    for (int v = 1; v <= n; v++) if (!indeg[v]) q.push(v);
    while (!q.empty()) {
        int u = q.front(); q.pop();
        order.push_back(u);
        for (int v : g[u]) if (--indeg[v] == 0) q.push(v);
    }
    // best[v] = máximo de ciudades de 1 a v (-1 si no se puede llegar), par[v] = ciudad anterior
    vector<int> best(n + 1, -1), par(n + 1, 0);
    best[1] = 1;
    for (int u : order) {
        if (best[u] < 0) continue;
        for (int v : g[u])
            if (best[u] + 1 > best[v]) best[v] = best[u] + 1, par[v] = u;
    }
    if (best[n] < 0) { cout << "IMPOSSIBLE\n"; return 0; }
    vector<int> path;
    for (int v = n; v != 1; v = par[v]) path.push_back(v);
    path.push_back(1);
    reverse(all(path));
    cout << path.size() << "\n";
    for (int v : path) cout << v << ' ';
    cout << "\n";
    return 0;
}
