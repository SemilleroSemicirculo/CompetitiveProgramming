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
 * Algoritmo : Centroide de un árbol (tamaños de subárbol)
 * Problema  : CSES 2079 - Finding a Centroid (https://cses.fi/problemset/task/2079)
 * Entrada   : n, luego n-1 aristas "a b"
 * Salida    : un centroide
 * Complejidad: tiempo O(n), memoria O(n)
 */

int main() {
    fastio;

    int n;
    cin >> n;
    vector<vector<int>> adj(n+1);
    for (int i = 0; i < n-1; i++) {
        int a, b;
        cin >> a >> b;
        adj[a].push_back(b);
        adj[b].push_back(a);
    }

    // DFS iterativo: order guarda los nodos en preorden y parent su padre
    vector<int> parent(n+1, 0), order;
    order.reserve(n);
    stack<pair<int, int>> st;
    st.emplace(1, 0);

    while (!st.empty()) {
        auto [u, p] = st.top(); st.pop();
        parent[u] = p;
        order.push_back(u);
        for (int v : adj[u]) {
            if (v == p) continue;
            st.emplace(v, u);
        }
    }

    // dp[u] = tamaño del subárbol de u (se llena de las hojas hacia la raíz)
    vector<int> dp(n+1, 1);
    for (int i = n-1; i >= 0; --i) {
        int u = order[i];
        for (int v : adj[u]) {
            if (v == parent[u]) continue;
            dp[u] += dp[v];
        }
    }

    // centroide: ningún subárbol puede tener más de n/2 nodos
    int limit = n / 2;
    int u = 1;
    // se baja siempre hacia el hijo con subárbol demasiado grande. Al bajar a v, la parte "de arriba"
    // queda con n − dp[v] < n/2 nodos, así que nunca hace falta volver a subir.
    while (true) {
        int heavy = -1;
        for (int v : adj[u])
            if (v != parent[u] && dp[v] > limit) heavy = v;
        if (heavy == -1) break;   // ningún hijo pasa de n/2: u es el centroide
        u = heavy;
    }
    cout << u << '\n';

    return 0;
}
