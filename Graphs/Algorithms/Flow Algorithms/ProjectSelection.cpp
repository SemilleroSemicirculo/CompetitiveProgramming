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
 * Algoritmo : Selección de proyectos (clausura de peso máximo) como corte mínimo
 * Problema  : Codeforces 1082G - Petya and Graph (https://codeforces.com/problemset/problem/1082/G)
 * Entrada   : n m; pesos a_1 … a_n de los vértices; m aristas "u v w"
 * Salida    : el máximo de (suma de pesos de aristas elegidas) − (suma de pesos de vértices usados), al menos 0
 * Complejidad: tiempo O(V² E) con Dinic sobre n + m + 2 nodos, memoria O(n + m)
 */

struct Dinic {
    struct Edge { int to; ll cap; };
    vector<Edge> e;
    vector<vector<int>> G;
    vector<int> lvl, it;
    Dinic(int n) : G(n), lvl(n), it(n) {}
    void addEdge(int u, int v, ll c, ll rc = 0) {   // rc > 0: arista no dirigida
        G[u].push_back(e.size()); e.push_back({v, c});
        G[v].push_back(e.size()); e.push_back({u, rc});
    }
    bool bfs(int s, int t) {
        fill(all(lvl), -1); lvl[s] = 0;
        queue<int> q; q.push(s);
        while (!q.empty()) {
            int u = q.front(); q.pop();
            for (int id : G[u]) if (e[id].cap > 0 && lvl[e[id].to] < 0) lvl[e[id].to] = lvl[u] + 1, q.push(e[id].to);
        }
        return lvl[t] >= 0;
    }
    ll dfs(int u, int t, ll f) {
        if (u == t) return f;
        for (int &i = it[u]; i < (int)G[u].size(); i++) {
            Edge &x = e[G[u][i]];
            if (x.cap <= 0 || lvl[x.to] != lvl[u] + 1) continue;
            if (ll d = dfs(x.to, t, min(f, x.cap))) { x.cap -= d; e[G[u][i] ^ 1].cap += d; return d; }
        }
        return 0;
    }
    ll maxflow(int s, int t) {
        ll flow = 0;
        while (bfs(s, t)) { fill(all(it), 0); while (ll f = dfs(s, t, INF)) flow += f; }
        return flow;
    }
};

// Cada arista es un "proyecto" que gana w y exige comprar sus dos vértices ("herramientas") que cuestan a.
// Corte mínimo: fuente → proyecto (w), proyecto → herramienta (∞), herramienta → sumidero (a).
// Ganancia máxima = suma de todas las ganancias − corte mínimo.
int main() {
    fastio;
    int n, m;
    cin >> n >> m;
    int S = 0, T = n + m + 1;
    Dinic d(n + m + 2);
    for (int i = 1; i <= n; i++) { ll a; cin >> a; d.addEdge(i, T, a); }
    ll total = 0;
    for (int j = 1; j <= m; j++) {
        int u, v; ll w;
        cin >> u >> v >> w;
        total += w;
        d.addEdge(S, n + j, w);
        d.addEdge(n + j, u, INF);
        d.addEdge(n + j, v, INF);
    }
    cout << total - d.maxflow(S, T) << "\n";
    return 0;
}
