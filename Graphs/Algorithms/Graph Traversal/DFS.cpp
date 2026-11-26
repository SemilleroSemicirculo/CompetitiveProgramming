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
 * Algoritmo : DFS (componentes conexas)
 * Problema  : CSES 1666 - Building Roads (https://cses.fi/problemset/task/1666)
 * Entrada   : n m, luego m aristas "a b"
 * Salida    : cantidad mínima de caminos a construir y las aristas que conectan las componentes
 * Complejidad: tiempo O(n + m), memoria O(n + m)
 */

// visited[u] indica si u ya fue explorado
vector<vector<int>> G;
vector<bool> visited;

// explora toda la componente de u
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
    // un representante por cada componente conexa
    vector<int> reps;
    for (int i = 1; i <= n; i++) {
        if (!visited[i]) {
            reps.push_back(i);
            dfs(i);
        }
    }

    // se necesitan (componentes - 1) caminos para unirlas
    cout << reps.size() - 1 << "\n";
    for (int i = 1; i < (int)reps.size(); i++)
        cout << reps[i - 1] << ' ' << reps[i] << "\n";
    return 0;
}
