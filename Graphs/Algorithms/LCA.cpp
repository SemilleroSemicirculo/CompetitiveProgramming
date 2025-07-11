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

    ll n, q;
    cin >> n >> q;

    vector<vector<ll>> children(n + 1);
    // read bosses e[2..n]
    for (ll i = 2; i <= n; ++i) {
        ll b;
        cin >> b;
        children[b].push_back(i);
    }

    // compute depth and immediate parent
    vector<ll> depth(n + 1), parent(n + 1);
    queue<ll> bfs;
    depth[1] = 0;
    parent[1] = 1;
    bfs.push(1);
    while (!bfs.empty()) {
        ll u = bfs.front(); bfs.pop();
        for (ll v : children[u]) {
            depth[v] = depth[u] + 1;
            parent[v] = u;
            bfs.push(v);
        }
    }

    // binary lifting table
    const int LOG = 19; // since 2^18 > 2e5
    vector<array<ll, LOG>> up(n + 1);
    for (ll i = 1; i <= n; ++i) {
        up[i][0] = parent[i];
    }
    for (int j = 1; j < LOG; ++j) {
        for (ll i = 1; i <= n; ++i) {
            up[i][j] = up[ up[i][j - 1] ][j - 1];
        }
    }

    auto lca = [&](ll a, ll b) {
        if (depth[a] < depth[b]) swap(a, b);
        ll diff = depth[a] - depth[b];
        for (int j = 0; j < LOG; ++j) {
            if (diff & (1LL << j)) {
                a = up[a][j];
            }
        }
        if (a == b) return a;
        for (int j = LOG - 1; j >= 0; --j) {
            if (up[a][j] != up[b][j]) {
                a = up[a][j];
                b = up[b][j];
            }
        }
        return parent[a];
    };

    while (q--) {
        ll a, b;
        cin >> a >> b;
        cout << lca(a, b) << '\n';
    }

    return 0;
}
