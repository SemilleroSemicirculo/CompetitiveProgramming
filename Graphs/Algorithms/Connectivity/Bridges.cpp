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
 * Algoritmo : Puentes de un grafo no dirigido (tiempos de descubrimiento y low, DFS sin recursión)
 * Problema  : CSES 2076 - Necessary Roads (https://cses.fi/problemset/task/2076)
 * Entrada   : n, m; luego m aristas a b (grafo conexo, sin aristas repetidas)
 * Salida    : la cantidad de puentes y cada puente "a b" (en cualquier orden)
 * Complejidad: tiempo O(n + m), memoria O(n + m)
 */

int main() {
    fastio;
    int n, m;
    cin >> n >> m;
    vector<vector<pair<int, int>>> g(n + 1);   // (vecino, id de la arista)
    vector<pair<int, int>> E(m);
    for (int i = 0; i < m; i++) {
        auto &[a, b] = E[i];
        cin >> a >> b;
        g[a].push_back({b, i});
        g[b].push_back({a, i});
    }
    // tin[u] = momento en que se descubre u; low[u] = menor tin alcanzable desde el subárbol
    // de u usando una sola arista de retroceso
    vector<int> tin(n + 1, 0), low(n + 1, 0), pe(n + 1, -1), it(n + 1, 0);
    vector<pair<int, int>> puentes;
    int timer = 0;
    for (int s = 1; s <= n; s++) {
        if (tin[s]) continue;
        vector<int> st = {s};
        tin[s] = low[s] = ++timer;
        while (!st.empty()) {
            int u = st.back();
            if (it[u] < (int)g[u].size()) {
                auto [v, id] = g[u][it[u]++];
                if (id == pe[u]) continue;                  // no volver por la arista del padre
                if (tin[v]) low[u] = min(low[u], tin[v]);  // arista de retroceso
                else { tin[v] = low[v] = ++timer; pe[v] = id; st.push_back(v); }
            } else {
                st.pop_back();
                if (!st.empty()) {
                    int p = st.back();
                    low[p] = min(low[p], low[u]);
                    // nada del subárbol de u sube por encima de u: la arista p–u es puente
                    if (low[u] > tin[p]) puentes.push_back(E[pe[u]]);
                }
            }
        }
    }
    cout << puentes.size() << "\n";
    for (auto [a, b] : puentes) cout << a << " " << b << "\n";
    return 0;
}
