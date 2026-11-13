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
 * Algoritmo : Kosaraju (componentes fuertemente conexas)
 * Problema  : CSES 1683 - Planets and Kingdoms (https://cses.fi/problemset/task/1683)
 * Entrada   : n m, luego m aristas dirigidas "a b"
 * Salida    : cantidad de reinos (SCC) y el reino de cada nodo
 * Complejidad: tiempo O(n + m), memoria O(n + m)
 */

// G = grafo y GT = grafo con las aristas invertidas
vector<vector<int>> G, GT;
vector<int> order, comp;
vector<bool> visited;

// primera pasada: se guarda el orden de salida de cada nodo
void dfs1(int u) {
    visited[u] = true;
    for (int v : G[u])
        if (!visited[v]) dfs1(v);
    order.push_back(u);  // orden de salida
}

// segunda pasada sobre GT: todo lo alcanzado forma una SCC
void dfs2(int u, int c) {
    comp[u] = c;
    for (int v : GT[u])
        if (comp[v] == 0) dfs2(v, c);
}

int main() {
    fastio;
    int n, m;
    cin >> n >> m;
    G.assign(n + 1, {});
    GT.assign(n + 1, {});
    visited.assign(n + 1, false);
    comp.assign(n + 1, 0);
    for (int i = 0; i < m; i++) {
        int a, b;
        cin >> a >> b;
        G[a].push_back(b);
        GT[b].push_back(a);
    }

    for (int i = 1; i <= n; i++)
        if (!visited[i]) dfs1(i);

    // segunda pasada sobre el grafo transpuesto en orden de salida inverso
    int c = 0;
    // se procesan los nodos en orden de salida decreciente
    for (int i = n - 1; i >= 0; i--)
        if (comp[order[i]] == 0) dfs2(order[i], ++c);

    cout << c << "\n";
    for (int i = 1; i <= n; i++) cout << comp[i] << ' ';
    cout << "\n";
    return 0;
}
