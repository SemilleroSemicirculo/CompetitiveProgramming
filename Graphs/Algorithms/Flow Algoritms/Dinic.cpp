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
 * Algoritmo : Dinic (flujo máximo)
 * Problema  : CSES 1694 - Download Speed (https://cses.fi/problemset/task/1694)
 * Entrada   : n m, luego m aristas dirigidas "a b c" (capacidad c)
 * Salida    : el flujo máximo de 1 a n
 * Complejidad: tiempo O(V^2 · E), memoria O(V + E)
 */

struct Dinic {
    struct Edge {
        int to;
        ll cap;
    };
    int n;
    vector<Edge> edges;
    vector<vector<int>> G;
    vector<int> level, it;

    Dinic(int n): n(n), G(n + 1), level(n + 1), it(n + 1) {}

    void addEdge(int u, int v, ll cap) {
        G[u].push_back(edges.size());
        edges.push_back({v, cap});
        G[v].push_back(edges.size());
        edges.push_back({u, 0});
    }

    bool bfs(int s, int t) {
        fill(all(level), -1);
        queue<int> q;
        level[s] = 0;
        q.push(s);
        while (!q.empty()) {
            int u = q.front();
            q.pop();
            for (int id : G[u]) {
                if (edges[id].cap > 0 && level[edges[id].to] == -1) {
                    level[edges[id].to] = level[u] + 1;
                    q.push(edges[id].to);
                }
            }
        }
        return level[t] != -1;
    }

    ll dfs(int v, int t, ll pushed) {
        if (v == t || pushed == 0) return pushed;
        for (int &i = it[v]; i < (int)G[v].size(); i++) {
            int id = G[v][i];
            int u = edges[id].to;
            if (level[u] != level[v] + 1 || edges[id].cap == 0) continue;
            ll f = dfs(u, t, min(pushed, edges[id].cap));
            if (f > 0) {
                edges[id].cap -= f;
                edges[id ^ 1].cap += f;
                return f;
            }
        }
        return 0;
    }

    ll maxflow(int s, int t) {
        ll flow = 0;
        while (bfs(s, t)) {
            fill(all(it), 0);
            while (ll f = dfs(s, t, INF)) flow += f;
        }
        return flow;
    }
};

int main() {
    fastio;
    int n, m;
    cin >> n >> m;
    Dinic flow(n);
    for (int i = 0; i < m; i++) {
        int a, b;
        ll c;
        cin >> a >> b >> c;
        flow.addEdge(a, b, c);
    }
    cout << flow.maxflow(1, n) << "\n";
    return 0;
}
