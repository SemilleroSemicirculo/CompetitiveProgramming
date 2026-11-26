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
 * Algoritmo : Puntos de articulación de un grafo no dirigido (low-link, DFS sin recursión)
 * Problema  : CSES 2077 - Necessary Cities (https://cses.fi/problemset/task/2077)
 * Entrada   : n, m; luego m aristas a b (grafo conexo)
 * Salida    : la cantidad de puntos de articulación y la lista (en cualquier orden)
 * Complejidad: tiempo O(n + m), memoria O(n + m)
 */

int main() {
    fastio;
    int n, m;
    cin >> n >> m;
    vector<vector<int>> g(n + 1);
    for (int i = 0; i < m; i++) {
        int a, b;
        cin >> a >> b;
        g[a].push_back(b);
        g[b].push_back(a);
    }
    vector<int> tin(n + 1, 0), low(n + 1, 0), par(n + 1, 0), it(n + 1, 0), hijos(n + 1, 0);
    vector<bool> corte(n + 1, false);
    int timer = 0;
    for (int s = 1; s <= n; s++) {
        if (tin[s]) continue;
        vector<int> st = {s};
        tin[s] = low[s] = ++timer;
        par[s] = 0;
        while (!st.empty()) {
            int u = st.back();
            if (it[u] < (int)g[u].size()) {
                int v = g[u][it[u]++];
                if (v == par[u]) continue;
                if (tin[v]) low[u] = min(low[u], tin[v]);
                else { tin[v] = low[v] = ++timer; par[v] = u; hijos[u]++; st.push_back(v); }
            } else {
                st.pop_back();
                int p = par[u];
                if (p) {
                    low[p] = min(low[p], low[u]);
                    // el subárbol de u no tiene otra salida que pasar por p
                    if (par[p] && low[u] >= tin[p]) corte[p] = true;
                }
            }
        }
        if (hijos[s] >= 2) corte[s] = true;   // la raíz es de corte si tiene 2 hijos en el DFS
    }
    vector<int> res;
    for (int u = 1; u <= n; u++) if (corte[u]) res.push_back(u);
    cout << res.size() << "\n";
    for (int i = 0; i < (int)res.size(); i++) cout << res[i] << " \n"[i + 1 == (int)res.size()];
    return 0;
}
