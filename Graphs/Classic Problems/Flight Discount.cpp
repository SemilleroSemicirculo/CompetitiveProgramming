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
 * Algoritmo : Dijkstra desde el origen y desde el destino (grafo invertido) para usar un cupón
 * Problema  : CSES 1195 - Flight Discount (https://cses.fi/problemset/task/1195)
 * Entrada   : n m, luego m vuelos dirigidos "a b c"
 * Salida    : el precio mínimo de 1 a n pudiendo pagar la mitad (redondeada abajo) de un solo vuelo
 * Complejidad: tiempo O((n + m) log n), memoria O(n + m)
 */

typedef vector<vector<pair<int, ll>>> Graph;

vector<ll> dijkstra(const Graph &g, int s) {
    vector<ll> d(g.size(), INF);
    priority_queue<pair<ll, int>, vector<pair<ll, int>>, greater<>> pq;
    d[s] = 0;
    pq.push({0, s});
    while (!pq.empty()) {
        auto [du, u] = pq.top();
        pq.pop();
        if (du != d[u]) continue;  // entrada vieja
        for (auto [v, c] : g[u])
            if (du + c < d[v]) d[v] = du + c, pq.push({d[v], v});
    }
    return d;
}

int main() {
    fastio;
    int n, m;
    cin >> n >> m;
    Graph g(n + 1), rg(n + 1);
    vector<array<ll, 3>> e(m);
    for (auto &[a, b, c] : e) {
        cin >> a >> b >> c;
        g[a].push_back({(int)b, c});
        rg[b].push_back({(int)a, c});  // grafo al revés: distancias hacia n
    }
    vector<ll> from1 = dijkstra(g, 1), toN = dijkstra(rg, n);
    // el cupón se usa en algún vuelo a -> b: ir de 1 a a, pagar c/2, ir de b a n
    ll best = INF;
    for (auto [a, b, c] : e)
        if (from1[a] < INF && toN[b] < INF) best = min(best, from1[a] + c / 2 + toN[b]);
    cout << best << "\n";
    return 0;
}
