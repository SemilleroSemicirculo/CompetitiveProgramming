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
 * Algoritmo : Distancia máxima desde cada nodo (extremos del diámetro)
 * Problema  : CSES 1132 - Tree Distances I (https://cses.fi/problemset/task/1132)
 * Entrada   : n, luego n-1 aristas "a b"
 * Salida    : para cada nodo, la distancia al nodo más lejano
 * Complejidad: tiempo O(n), memoria O(n)
 */

vector<vector<int>> G;

// BFS: distancias desde s
// BFS: distancias desde s
vector<int> bfs(int s) {
    vector<int> dist(G.size(), -1);
    queue<int> q;
    dist[s] = 0;
    q.push(s);
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        for (int v : G[u])
            if (dist[v] == -1) {
                dist[v] = dist[u] + 1;
                q.push(v);
            }
    }
    return dist;
}

int main() {
    fastio;
    int n;
    cin >> n;
    G.assign(n + 1, {});
    for (int i = 0; i < n - 1; i++) {
        int a, b;
        cin >> a >> b;
        G[a].push_back(b);
        G[b].push_back(a);
    }

    // el más lejano de cualquier nodo es un extremo A del diámetro; el más lejano de A es B
    // el nodo más lejano de cualquier nodo es un extremo A del diámetro
    auto d0 = bfs(1);
    int A = max_element(d0.begin() + 1, d0.end()) - d0.begin();
    auto dA = bfs(A);
    int B = max_element(dA.begin() + 1, dA.end()) - dA.begin();
    auto dB = bfs(B);

    // la distancia máxima desde v es max(dist a A, dist a B)
    // la distancia máxima desde v es max(dist a A, dist a B)
    for (int v = 1; v <= n; v++) cout << max(dA[v], dB[v]) << ' ';
    cout << "\n";
    return 0;
}
