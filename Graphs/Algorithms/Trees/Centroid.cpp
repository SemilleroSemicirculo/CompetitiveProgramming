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
    // se baja siempre hacia el hijo con subárbol demasiado grande
    while (true) {
        bool moved = false;
        for (int v : adj[u]) {
            if (v != parent[u] && dp[v] > limit) {
                parent[u] = u;
                u = v;
                moved = true;
                break;
            }
        }
        if (moved) continue;

        // si tampoco la parte "de arriba" es grande, u es el centroide
        if (n - dp[u] <= limit) {
            cout << u << '\n';
            break;
        }

        u = parent[u];
    }

    return 0;
}
