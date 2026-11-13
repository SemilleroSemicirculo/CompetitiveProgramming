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
 * Algoritmo : Edmonds-Karp (flujo máximo con BFS)
 * Problema  : CSES 1694 - Download Speed (https://cses.fi/problemset/task/1694)
 * Entrada   : n m, luego m aristas dirigidas "a b c" (capacidad c)
 * Salida    : el flujo máximo de 1 a n
 * Complejidad: tiempo O(V · E^2), memoria O(V^2)
 */

int n;
// capacity[u][v] = capacidad residual; adj solo para recorrer vecinos
vector<vector<ll>> capacity;
vector<vector<int>> adj;

// BFS que busca un camino aumentante; devuelve el cuello de botella
// BFS que busca un camino aumentante; devuelve el cuello de botella
ll bfs(int s, int t, vector<int> &parent) {
    fill(all(parent), -1);
    parent[s] = -2;
    queue<pair<int, ll>> q;
    q.push({s, INF});
    while (!q.empty()) {
        auto [u, flow] = q.front();
        q.pop();
        for (int v : adj[u]) {
            if (parent[v] == -1 && capacity[u][v] > 0) {
                parent[v] = u;
                ll new_flow = min(flow, capacity[u][v]);
                if (v == t) return new_flow;
                q.push({v, new_flow});
            }
        }
    }
    return 0;
}

// se aumenta el flujo mientras haya camino
ll maxflow(int s, int t) {
    ll flow = 0;
    vector<int> parent(n + 1);
    while (ll new_flow = bfs(s, t, parent)) {
        flow += new_flow;
        int cur = t;
        while (cur != s) {
            int prev = parent[cur];
            // se resta en la arista y se suma en la inversa
            capacity[prev][cur] -= new_flow;
            capacity[cur][prev] += new_flow;
            cur = prev;
        }
    }
    return flow;
}

int main() {
    fastio;
    int m;
    cin >> n >> m;
    capacity.assign(n + 1, vector<ll>(n + 1, 0));
    adj.assign(n + 1, {});
    for (int i = 0; i < m; i++) {
        int a, b;
        ll c;
        cin >> a >> b >> c;
        if (capacity[a][b] == 0 && capacity[b][a] == 0) {
            adj[a].push_back(b);
            adj[b].push_back(a);
        }
        // se suman capacidades si hay aristas repetidas
        capacity[a][b] += c;
    }
    cout << maxflow(1, n) << "\n";
    return 0;
}
