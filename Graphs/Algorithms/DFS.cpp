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

    vector<bool> vis(n, false);
    stack<ll> st;
    st.push(0);

    while (!st.empty()) {
        ll v = st.top(); st.pop();
        if (vis[v]) continue;
        vis[v] = true;
        for (ll u : G[v]) {
            if (!vis[u]) st.push(u);
        }
    }

    return 0;
}
