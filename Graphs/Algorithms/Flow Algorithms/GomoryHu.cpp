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
 * Algoritmo : Árbol de Gomory-Hu (n − 1 flujos dan el corte mínimo entre todo par de vértices). Basado en KACTL (CC0)
 * Problema  : problema propio (cortes mínimos entre pares en un grafo no dirigido)
 * Entrada   : n m; m aristas no dirigidas "a b c" (1-indexadas); q; q consultas "u v" (u ≠ v)
 * Salida    : para cada consulta, el corte mínimo (= flujo máximo) entre u y v
 * Complejidad: tiempo O(n · flujo) para el árbol y O(n) por consulta, memoria O(n + m)
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

int main() {
    fastio;
    int n, m;
    cin >> n >> m;
    vector<array<ll, 3>> ed(m);
    for (auto &x : ed) { cin >> x[0] >> x[1] >> x[2]; x[0]--; x[1]--; }
    // Gusfield: cada vértice i se corta contra su padre actual; los del lado de i que colgaban
    // del mismo padre pasan a colgar de i. El árbol resultante guarda en cada arista un corte mínimo.
    vector<int> par(n, 0);
    vector<ll> peso(n, 0);
    for (int i = 1; i < n; i++) {
        Dinic d(n);
        for (auto &x : ed) d.addEdge(x[0], x[1], x[2], x[2]);
        peso[i] = d.maxflow(i, par[i]);
        for (int j = i + 1; j < n; j++) if (par[j] == par[i] && d.lvl[j] >= 0) par[j] = i;   // lado de i en el corte
    }
    vector<vector<pair<int, ll>>> g(n);
    for (int i = 1; i < n; i++) g[i].push_back({par[i], peso[i]}), g[par[i]].push_back({i, peso[i]});
    int q;
    cin >> q;
    while (q--) {   // corte mínimo entre u y v = arista más liviana del camino en el árbol
        int u, v;
        cin >> u >> v; u--; v--;
        vector<ll> best(n, -1);
        vector<int> st = {u};
        best[u] = INF;
        while (!st.empty()) {
            int x = st.back(); st.pop_back();
            for (auto [y, w] : g[x]) if (best[y] < 0) best[y] = min(best[x], w), st.push_back(y);
        }
        cout << best[v] << "\n";
    }
    return 0;
}
