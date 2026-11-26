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
 * Algoritmo : Circulación con cotas inferiores (reducción a flujo máximo con fuente y sumidero nuevos)
 * Problema  : SGU 194 - Reactor Cooling (https://codeforces.com/problemsets/acmsguru/problem/99999/194)
 * Entrada   : N, M; luego M tubos "i j l c": de i a j deben pasar entre l y c unidades
 * Salida    : "YES" y el flujo de cada tubo en orden si hay circulación válida; si no, "NO"
 * Complejidad: tiempo O(V² · E) con Dinic, memoria O(V + E)
 */

struct Dinic {
    struct E { int to; ll cap; };
    vector<E> e;
    vector<vector<int>> g;
    vector<int> lvl, it;
    Dinic(int n) : g(n), lvl(n), it(n) {}
    int add(int a, int b, ll c) {
        g[a].push_back(e.size()); e.push_back({b, c});
        g[b].push_back(e.size()); e.push_back({a, 0});
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
    int N, M;
    cin >> N >> M;
    int S = 0, T = N + 1;                 // fuente y sumidero nuevos
    Dinic D(N + 2);
    vector<ll> exceso(N + 2, 0), low(M);
    vector<int> id(M);
    for (int k = 0; k < M; k++) {
        int i, j;
        ll l, c;
        cin >> i >> j >> l >> c;
        // se manda l "por obligación": queda libre c − l, y j recibe l de más e i entrega l de más
        low[k] = l;
        id[k] = D.add(i, j, c - l);
        exceso[j] += l;
        exceso[i] -= l;
    }
    ll necesario = 0;
    for (int v = 1; v <= N; v++) {
        if (exceso[v] > 0) D.add(S, v, exceso[v]), necesario += exceso[v];   // le sobra: lo reparte
        if (exceso[v] < 0) D.add(v, T, -exceso[v]);                          // le falta: lo pide
    }
    // hay circulación válida si y solo si se pueden satisfacer todos los excesos a la vez
    if (D.maxflow(S, T) != necesario) { cout << "NO\n"; return 0; }
    cout << "YES\n";
    for (int k = 0; k < M; k++) cout << low[k] + D.e[id[k] ^ 1].cap << "\n";   // l + lo que pasó
    return 0;
}
