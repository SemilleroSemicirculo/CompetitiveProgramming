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

int main(){
    fastio;

    ll n, m;
    cin >> n >> m;

    vector<vector<ll>> G(n);
    for (ll i = 0; i < m; ++i) {
        ll u, v;
        cin >> u >> v;
        u--, v--;
        G[u].push_back(v);
        G[v].push_back(u);
    }

    vector<ll> dist(n, INF);
    queue<ll> q;
    dist[0] = 0;
    q.push(0);

    while (!q.empty()) {
        ll v = q.front(); q.pop();
        for (ll u : G[v]) {
            if (dist[u] == INF) {
                dist[u] = dist[v] + 1;
                q.push(u);
            }
        }
    }

    return 0;
}
