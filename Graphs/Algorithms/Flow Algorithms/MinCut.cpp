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
 * Algoritmo : Corte mínimo reconstruido desde el flujo máximo (Dinic + nodos alcanzables en el residual)
 * Problema  : CSES 1695 - Police Chase (https://cses.fi/problemset/task/1695)
 * Entrada   : n, m; luego m calles a b (no dirigidas)
 * Salida    : el mínimo de calles a cerrar para separar 1 de n, y esas calles
 * Complejidad: tiempo O(V² · E) en general (mucho menos aquí: capacidades 1), memoria O(V + E)
 */

struct Dinic {
    struct E { int to; ll cap; };
    vector<E> e;
    vector<vector<int>> g;
    vector<int> lvl, it;
    Dinic(int n) : g(n), lvl(n), it(n) {}
    int add(int a, int b, ll c, ll rc = 0) {   // arista a→b con capacidad c (y b→a con rc)
        g[a].push_back(e.size()); e.push_back({b, c});
        g[b].push_back(e.size()); e.push_back({a, rc});
        return e.size() - 2;
    }
    bool bfs(int s, int t) {
        fill(all(lvl), -1);
        lvl[s] = 0;
        queue<int> q; q.push(s);
        while (!q.empty()) {
            int u = q.front(); q.pop();
            for (int id : g[u]) if (e[id].cap > 0 && lvl[e[id].to] < 0) lvl[e[id].to] = lvl[u] + 1, q.push(e[id].to);
        }
        return lvl[t] >= 0;
    }
    ll dfs(int u, int t, ll f) {
        if (u == t) return f;
        for (int &i = it[u]; i < (int)g[u].size(); i++) {
            int id = g[u][i], v = e[id].to;
            if (e[id].cap > 0 && lvl[v] == lvl[u] + 1) {
                ll d = dfs(v, t, min(f, e[id].cap));
                if (d > 0) { e[id].cap -= d; e[id ^ 1].cap += d; return d; }
            }
        }
        return 0;
    }
    ll maxflow(int s, int t) {
        ll f = 0;
        while (bfs(s, t)) {
            fill(all(it), 0);
            while (ll d = dfs(s, t, LLONG_MAX)) f += d;
        }
        return f;
    }
};

int main() {
    fastio;
    int n, m;
    cin >> n >> m;
    Dinic D(n + 1);
    vector<array<int, 3>> calles(m);   // (a, b, id de la arista en Dinic)
    for (auto &[a, b, id] : calles) {
        cin >> a >> b;
        id = D.add(a, b, 1, 1);         // no dirigida: capacidad 1 en los dos sentidos
    }
    ll f = D.maxflow(1, n);
    // los alcanzables desde 1 en el residual forman el lado S del corte mínimo:
    // las aristas de S a T están saturadas y su número es justo el flujo máximo
    vector<bool> enS(n + 1, false);
    vector<int> st = {1};
    enS[1] = true;
    while (!st.empty()) {
        int u = st.back(); st.pop_back();
        for (int id : D.g[u]) {
            int v = D.e[id].to;
            if (D.e[id].cap > 0 && !enS[v]) enS[v] = true, st.push_back(v);
        }
    }
    cout << f << "\n";
    for (auto [a, b, id] : calles)
        if (enS[a] != enS[b]) cout << a << " " << b << "\n";
    return 0;
}
