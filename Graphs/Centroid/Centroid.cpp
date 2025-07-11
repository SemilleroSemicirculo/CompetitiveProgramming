#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    cin >> n;
    vector<vector<int>> adj(n+1);
    for (int i = 0; i < n-1; i++) {
        int a, b;
        cin >> a >> b;
        adj[a].push_back(b);
        adj[b].push_back(a);
    }

    // 1) DFS iterativo para obtener parent[] y order[]
    vector<int> parent(n+1, 0);
    vector<int> order;
    order.reserve(n);
    stack<pair<int,int>> st;
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

    // 2) Calcular tamaños de subárbol dp[u]
    vector<int> dp(n+1, 1);
    for (int i = n-1; i >= 0; --i) {
        int u = order[i];
        for (int v : adj[u]) {
            if (v == parent[u]) continue;
            dp[u] += dp[v];
        }
    }

    // 3) Encontrar centroide
    int limit = n / 2;
    int u = 1;
    while (true) {
        bool moved = false;
        // Intentar bajar por hijo con subárbol > limit
        for (int v : adj[u]) {
            if (v != parent[u] && dp[v] > limit) {
                parent[u] = u; // opcional, marca para posible subida
                u = v;
                moved = true;
                break;
            }
        }
        if (moved) continue;

        // Si no se mueve hacia abajo, comprobar la parte "arriba"
        if (n - dp[u] <= limit) {
            cout << u << "\n";
            break;
        }
        // Si la parte de arriba es demasiado grande, subir
        u = parent[u];
    }

    return 0;
}
