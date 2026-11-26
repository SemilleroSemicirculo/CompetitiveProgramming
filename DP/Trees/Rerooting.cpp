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
 * Algoritmo : Rerooting (DP en árboles para todas las raíces en O(n))
 * Problema  : CSES 1133 - Tree Distances II (https://cses.fi/problemset/task/1133)
 * Entrada   : n; luego n − 1 aristas a b del árbol
 * Salida    : para cada nodo, la suma de sus distancias a todos los demás
 * Complejidad: tiempo O(n), memoria O(n)
 */

int main() {
    fastio;
    int n;
    cin >> n;
    vector<vector<int>> g(n + 1);
    for (int i = 0; i < n - 1; i++) {
        int a, b;
        cin >> a >> b;
        g[a].push_back(b);
        g[b].push_back(a);
    }
    vector<int> orden, par(n + 1, 0), st = {1};
    par[1] = -1;
    while (!st.empty()) {
        int u = st.back(); st.pop_back();
        orden.push_back(u);
        for (int v : g[u]) if (v != par[u]) par[v] = u, st.push_back(v);
    }
    // 1) hacia arriba: tamaño del subárbol y suma de distancias desde 1
    vector<ll> sz(n + 1, 1), ans(n + 1, 0);
    vector<int> prof(n + 1, 0);
    for (int u : orden) if (par[u] > 0) prof[u] = prof[par[u]] + 1;
    for (int i = n - 1; i > 0; i--) sz[par[orden[i]]] += sz[orden[i]];
    for (int u = 1; u <= n; u++) ans[1] += prof[u];
    // 2) hacia abajo: al mover la raíz de p a su hijo v, los sz[v] nodos del subárbol de v
    //    quedan 1 más cerca y los otros n − sz[v] quedan 1 más lejos
    for (int u : orden) if (par[u] > 0) ans[u] = ans[par[u]] + n - 2 * sz[u];
    for (int u = 1; u <= n; u++) cout << ans[u] << " \n"[u == n];
    return 0;
}
