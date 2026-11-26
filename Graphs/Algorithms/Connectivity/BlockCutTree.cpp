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
 * Algoritmo : Componentes biconexas (bloques) con Tarjan; los bloques y los puntos de articulación forman el block-cut tree
 * Problema  : Library Checker - Biconnected Components (https://judge.yosupo.jp/problem/biconnected_components)
 * Entrada   : N M; M aristas no dirigidas "a b" (0-indexadas; puede haber lazos y repetidas)
 * Salida    : K, la cantidad de bloques, y K líneas "l v_1 … v_l" con los vértices de cada bloque
 *             (un vértice aislado es un bloque por sí solo)
 * Complejidad: tiempo O(N + M), memoria O(N + M)
 */

// Al volver de un hijo v con low[v] ≥ tin[u], todo lo apilado desde v, más u, es un bloque.
// El block-cut tree une cada bloque con los puntos de articulación que contiene: es un árbol,
// y sobre él se responden preguntas como "¿todo camino de a a b pasa por c?".
int main() {
    fastio;
    int n, m;
    cin >> n >> m;
    vector<vector<pair<int, int>>> g(n);
    for (int i = 0; i < m; i++) {
        int a, b; cin >> a >> b;
        if (a == b) continue;
        g[a].push_back({b, i}); g[b].push_back({a, i});
    }
    vector<int> tin(n, -1), low(n), pila;
    vector<vector<int>> bloques;
    int t = 0;
    for (int r = 0; r < n; r++) {
        if (tin[r] >= 0) continue;
        if (g[r].empty()) { bloques.push_back({r}); tin[r] = t++; continue; }
        // DFS iterativo: (vértice, arista por la que llegó, siguiente vecino)
        vector<array<int, 3>> st = {{r, -1, 0}};
        tin[r] = low[r] = t++; pila.push_back(r);
        while (!st.empty()) {
            auto &[u, pe, i] = st.back();
            if (i < (int)g[u].size()) {
                auto [v, id] = g[u][i++];
                if (id == pe) continue;
                if (tin[v] >= 0) { low[u] = min(low[u], tin[v]); continue; }
                tin[v] = low[v] = t++; pila.push_back(v);
                st.push_back({v, id, 0});
            } else {
                int v = u; st.pop_back();
                if (st.empty()) break;
                int p = st.back()[0];
                low[p] = min(low[p], low[v]);
                if (low[v] >= tin[p]) {   // p separa a v (o p es la raíz): cerrar un bloque
                    vector<int> b = {p};
                    while (true) { int x = pila.back(); pila.pop_back(); b.push_back(x); if (x == v) break; }
                    bloques.push_back(b);
                }
            }
        }
        pila.clear();
    }
    cout << bloques.size() << "\n";
    for (auto &b : bloques) {
        cout << b.size();
        for (int x : b) cout << " " << x;
        cout << "\n";
    }
    return 0;
}
