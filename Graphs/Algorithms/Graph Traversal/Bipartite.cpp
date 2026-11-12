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
 * Algoritmo : Grafo bipartito (coloreo con BFS)
 * Problema  : CSES 1668 - Building Teams (https://cses.fi/problemset/task/1668)
 * Entrada   : n m, luego m aristas "a b"
 * Salida    : IMPOSSIBLE, o el equipo (1 o 2) de cada nodo
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

    vector<int> color(n + 1, 0);  // 0 = sin color
    for (int s = 1; s <= n; s++) {
        if (color[s]) continue;
        color[s] = 1;
        queue<int> q;
        q.push(s);
        while (!q.empty()) {
            int u = q.front();
            q.pop();
            for (int v : G[u]) {
                if (color[v] == 0) {
                    color[v] = 3 - color[u];
                    q.push(v);
                }
                else if (color[v] == color[u]) {
                    cout << "IMPOSSIBLE\n";
                    return 0;
                }
            }
        }
    }

    for (int i = 1; i <= n; i++) cout << color[i] << ' ';
    cout << "\n";
    return 0;
}
