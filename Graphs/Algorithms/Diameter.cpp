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

vector<vector<int>> g;
vector<int> dist_dfs;

pair<int,int> dfs_far(int u, int p) {
    // retorna {nodo más lejano, distancia a él}
    pair<int,int> best = {u, dist_dfs[u]};
    for (int v : g[u]) if (v != p) {
        dist_dfs[v] = dist_dfs[u] + 1;
        auto cand = dfs_far(v, u);
        if (cand.second > best.second) best = cand;
    }
    return best;
}

int main() {
    fastio;
    int n;
    cin >> n;
    g.assign(n+1, {});
    for (int i = 0; i < n-1; ++i) {
        int u, v;
        cin >> u >> v;
        g[u].push_back(v);
        g[v].push_back(u);
    }

    dist_dfs.assign(n+1, 0);
    // 1ª DFS: desde 1 para hallar vértice A más lejano
    auto a = dfs_far(1, 0).first;

    // 2ª DFS: desde A para hallar distancia máxima (diámetro)
    dist_dfs.assign(n+1, 0);
    auto b = dfs_far(a, 0);
    cout << b.second << "\n";

    return 0;
}
