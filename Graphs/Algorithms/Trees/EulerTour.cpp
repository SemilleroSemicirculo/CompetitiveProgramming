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
 * Algoritmo : Euler Tour + Fenwick Tree (consultas sobre subárboles)
 * Problema  : CSES 1137 - Subtree Queries (https://cses.fi/problemset/task/1137)
 * Entrada   : n q, n valores, n-1 aristas y q consultas: "1 s x" (valor del nodo s = x) o "2 s" (suma del subárbol de s)
 * Salida    : la suma de cada consulta de tipo 2
 * Complejidad: tiempo O((n + q) log n), memoria O(n)
 */

int n;
vector<vector<int>> G;
vector<int> tin, tout;
vector<ll> bit;

void add(int i, ll v) {
    for (; i <= n; i += i & -i) bit[i] += v;
}

ll sum(int i) {
    ll s = 0;
    for (; i > 0; i -= i & -i) s += bit[i];
    return s;
}

int main() {
    fastio;
    int q;
    cin >> n >> q;
    vector<ll> val(n + 1);
    for (int i = 1; i <= n; i++) cin >> val[i];
    G.assign(n + 1, {});
    for (int i = 0; i < n - 1; i++) {
        int a, b;
        cin >> a >> b;
        G[a].push_back(b);
        G[b].push_back(a);
    }

    // DFS iterativo: tin/tout marcan el intervalo del subárbol
    tin.assign(n + 1, 0), tout.assign(n + 1, 0);
    vector<int> parent(n + 1, 0), idx(n + 1, 0), st = {1};
    int timer = 0;
    tin[1] = ++timer;
    while (!st.empty()) {
        int u = st.back();
        if (idx[u] < (int)G[u].size()) {
            int v = G[u][idx[u]++];
            if (v == parent[u]) continue;
            parent[v] = u;
            tin[v] = ++timer;
            st.push_back(v);
        }
        else {
            tout[u] = timer;
            st.pop_back();
        }
    }

    bit.assign(n + 2, 0);
    for (int i = 1; i <= n; i++) add(tin[i], val[i]);

    while (q--) {
        int type, s;
        cin >> type >> s;
        if (type == 1) {
            ll x;
            cin >> x;
            add(tin[s], x - val[s]);
            val[s] = x;
        }
        else cout << sum(tout[s]) - sum(tin[s] - 1) << "\n";
    }
    return 0;
}
