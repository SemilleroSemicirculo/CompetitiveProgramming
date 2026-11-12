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
 * Algoritmo : DFS (componentes conexas)
 * Problema  : CSES 1666 - Building Roads (https://cses.fi/problemset/task/1666)
 * Entrada   : n m, luego m aristas "a b"
 * Salida    : cantidad mínima de caminos a construir y las aristas que conectan las componentes
 * Complejidad: tiempo O(n + m), memoria O(n + m)
 */

vector<vector<int>> G;
vector<bool> visited;

void dfs(int u) {
    visited[u] = true;
    for (int v : G[u])
        if (!visited[v]) dfs(v);
}

int main() {
    fastio;
    int n, m;
    cin >> n >> m;
    G.assign(n + 1, {});
    visited.assign(n + 1, false);
    for (int i = 0; i < m; i++) {
        int a, b;
        cin >> a >> b;
        G[a].push_back(b);
        G[b].push_back(a);
    }

    // un representante por componente; se unen en cadena
    vector<int> reps;
    for (int i = 1; i <= n; i++) {
        if (!visited[i]) {
            reps.push_back(i);
            dfs(i);
        }
    }

    cout << reps.size() - 1 << "\n";
    for (int i = 1; i < (int)reps.size(); i++)
        cout << reps[i - 1] << ' ' << reps[i] << "\n";
    return 0;
}
