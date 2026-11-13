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
 * Algoritmo : BFS (camino más corto en grafo no ponderado)
 * Problema  : CSES 1667 - Message Route (https://cses.fi/problemset/task/1667)
 * Entrada   : n m, luego m aristas "a b"
 * Salida    : IMPOSSIBLE, o la cantidad de nodos y un camino mínimo de 1 a n
 * Complejidad: tiempo O(n + m), memoria O(n + m)
 */

int main() {
    fastio;
    int n, m;
    cin >> n >> m;
    vector<vector<int>> G(n + 1);
    for (int i = 0; i < m; i++) {
        int a, b;
        cin >> a >> b;
        G[a].push_back(b);
        G[b].push_back(a);
    }

    // dist[v] = aristas desde 1, parent[v] = nodo anterior en el camino mínimo
    vector<int> dist(n + 1, -1), parent(n + 1, 0);
    queue<int> q;
    dist[1] = 0;
    q.push(1);
    // BFS: visita por capas, así la primera vez que se llega a un nodo es por el camino más corto
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        for (int v : G[u]) {
            if (dist[v] != -1) continue;
            dist[v] = dist[u] + 1;
            parent[v] = u;
            q.push(v);
        }
    }

    if (dist[n] == -1) {
        cout << "IMPOSSIBLE\n";
        return 0;
    }
    // se reconstruye el camino desde n hasta 1 con parent[]
    vector<int> path;
    for (int v = n; v != 0; v = parent[v]) path.push_back(v);
    reverse(all(path));
    cout << path.size() << "\n";
    for (int v : path) cout << v << ' ';
    cout << "\n";
    return 0;
}
