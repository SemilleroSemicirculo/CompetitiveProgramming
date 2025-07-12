#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef long double ld;
const ll INF = numeric_limits<ll>::max();

#define all(x) x.begin(), x.end()
#define rall(x) x.rbegin(), x.rend()
#define MOD 998244353
// #define MOD pow(10, 9)+7;
// #define MOD 3245284303;
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

    vector<vector<pair<ll, ll>>> graph(n);
    for (ll i = 0; i < m; ++i) {
        ll a, b, w;
        cin >> a >> b >> w;
        a--, b--;
        graph[a].emplace_back(b, w);
        graph[b].emplace_back(a, w);
    }

    vector<ll> dis(n, INF), parent(n, -1);
    priority_queue<pair<ll, ll>, vector<pair<ll, ll>>, greater<>> pq;

    dis[0] = 0;
    pq.emplace(0, 0);

    while (!pq.empty()) {
        auto [d_v, v] = pq.top(); pq.pop();
        if (d_v > dis[v]) continue;

        for (auto &[u, w] : graph[v]) {
            ll d_u = d_v + w;
            if (d_u < dis[u]) {
                dis[u] = d_u;
                parent[u] = v;
                pq.emplace(d_u, u);
            }
        }
    }

    if (dis[n - 1] == INF) {
        cout << -1 << '\n';
    } else {
        vector<ll> path;
        for (ll v = n - 1; v != -1; v = parent[v]) {
            path.push_back(v + 1);
        }
        reverse(all(path));
        for (ll v : path) cout << v << ' ';
        cout << '\n';
    }

    return 0;
}
