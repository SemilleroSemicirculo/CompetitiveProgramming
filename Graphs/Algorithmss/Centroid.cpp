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

    int n;
    cin >> n;
    vector<vector<int>> adj(n+1);
    for (int i = 0; i < n-1; i++) {
        int a, b;
        cin >> a >> b;
        adj[a].push_back(b);
        adj[b].push_back(a);
    }

    vector<int> parent(n+1, 0), order;
    order.reserve(n);
    stack<pair<int, int>> st;
    st.emplace(1, 0);

    while (!st.empty()) {
        auto [u, p] = st.top(); st.pop();
        parent[u] = p;
        order.push_back(u);
        for (int v : adj[u]) {
            if (v == p) continue;
            st.emplace(v, u);
        }
    }

    vector<int> dp(n+1, 1);
    for (int i = n-1; i >= 0; --i) {
        int u = order[i];
        for (int v : adj[u]) {
            if (v == parent[u]) continue;
            dp[u] += dp[v];
        }
    }

    int limit = n / 2;
    int u = 1;
    while (true) {
        bool moved = false;
        for (int v : adj[u]) {
            if (v != parent[u] && dp[v] > limit) {
                parent[u] = u;
                u = v;
                moved = true;
                break;
            }
        }
        if (moved) continue;

        if (n - dp[u] <= limit) {
            cout << u << '\n';
            break;
        }

        u = parent[u];
    }

    return 0;
}
