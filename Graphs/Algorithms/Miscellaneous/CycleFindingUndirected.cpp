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
 
vector<bool> on_stack;
vector<bool> vis;
vector<vector<ll>> ady;
vector<ll> cycle;
vector<ll> parent;
 
bool DFS(ll v, ll p){
    parent[v] = p;
    vis[v] = true;
    on_stack[v] = true;
 
    for (auto u : ady[v]) {
        if(u == p) continue;
 
        if (!vis[u]) {
            if (DFS(u, v)) return true;
        } else if (on_stack[u]) {
            cycle.clear();
            cycle.push_back(u);
            for (ll x = v; x != u; x = parent[x]) {
                cycle.push_back(x);
            }
            cycle.push_back(u); 
            return true;
        }
    }
 
    on_stack[v] = false;
    return false;
}
 
int main(){
    fastio;
 
    ll n, m; cin >> n >> m;
    ady.assign(n, {});
    for (int i = 0; i < m; i++){
        ll u, v; cin >> u >> v; u--; v--;
        ady[u].push_back(v);
        ady[v].push_back(u);
    }
 
    on_stack.assign(n, false);
    vis.assign(n, false);
    parent.assign(n, -1);
 
    for (int i = 0; i < n; i++){
        if (!vis[i]) {
            if (DFS(i, -1)) {
                cout << cycle.size() << "\n";
                for (auto node : cycle) cout << node + 1 << " ";
                cout << "\n";
                return 0;
            }
        }
    }
 
    cout << "IMPOSSIBLE\n";
}