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
 * Algoritmo : Esperanza en un árbol (probabilidad de llegar a cada hoja)
 * Problema  : Codeforces 839C - Journey (https://codeforces.com/problemset/problem/839/C)
 * Entrada   : n, luego n − 1 caminos "u v"
 * Salida    : largo esperado del viaje desde la ciudad 1 (error ≤ 10^-6)
 * Complejidad: tiempo O(n), memoria O(n)
 */

int main() {
    fastio;
    int n;
    cin >> n;
    vector<vector<int>> g(n + 1);
    for (int i = 0; i < n - 1; i++) {
        int u, v;
        cin >> u >> v;
        g[u].push_back(v), g[v].push_back(u);
    }
    // prob[v] = probabilidad de pasar por v; el caballo elige uniforme entre los hijos no visitados
    vector<double> prob(n + 1, 0.0);
    vector<int> depth(n + 1, 0), par(n + 1, 0);
    prob[1] = 1.0;
    double res = 0;
    vector<int> order = {1};
    for (int k = 0; k < (int)order.size(); k++) {
        int u = order[k];
        int hijos = g[u].size() - (u != 1);
        if (hijos == 0) res += prob[u] * depth[u];  // el viaje termina en una hoja
        for (int v : g[u]) if (v != par[u]) {
            par[v] = u, depth[v] = depth[u] + 1, prob[v] = prob[u] / hijos;
            order.push_back(v);
        }
    }
    precision(12);
    cout << res << "\n";
    return 0;
}
