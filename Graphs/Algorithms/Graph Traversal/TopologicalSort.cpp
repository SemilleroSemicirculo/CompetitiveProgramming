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

int main() {
    fastio;
    ll n, m;
    cin >> n >> m;

    vector<vector<ll>> G(n);
    vector<ll> indeg(n, 0);
    for (ll i = 0; i < m; ++i) {
        ll u, v;
        cin >> u >> v;
        u--, v--;
        G[u].push_back(v);
        indeg[v]++;
    }

    // Kahn: se procesan primero los nodos sin aristas entrantes
    queue<ll> q;
    for (ll i = 0; i < n; ++i)
        if (indeg[i] == 0) q.push(i);

    vector<ll> order;
    while (!q.empty()) {
        ll v = q.front(); q.pop();
        order.push_back(v);
        for (ll u : G[v]) {
            if (--indeg[u] == 0) q.push(u);
        }
    }

    // si no entraron todos los nodos hay un ciclo
    if ((ll)order.size() < n) {
        cout << "IMPOSSIBLE\n";
    } else {
        for (ll v : order) cout << v + 1 << ' ';
        cout << '\n';
    }
    return 0;
}
