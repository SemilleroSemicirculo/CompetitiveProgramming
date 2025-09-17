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

struct Edge{
    ll to, id;
};

int main(){
    fastio;

    ll n, m; cin >> n >> m;
    vector<vector<Edge>> ady(n, vector<Edge>());
    vector<bool> used(m, false);

    for(int i = 0; i < m; i++){
        ll u, v; cin >> u >> v;
        u--; v--;
        ady[u].push_back({v, i});
        ady[v].push_back({u, i});
    }

    vector<ll> cycle;
    vector<bool> vis(n, false);
    stack<ll> ss; ss.push(0);

    while (!ss.empty())
    {
        ll v = ss.top(); ss.pop();
        for(auto [u, i]: ady[v]){
            if(!vis[u]) ss.push(u);
        }
        vis[v] = true;
    }

    bool agg = true;
    for(int i = 0; i < n; i++){
        if(ady[i].size() == 0) vis[i] = true;
        else if(ady[i].size() & 1) agg = false;

        if(vis[i] == false) agg = false;
    }
    
    if(!agg){
        cout << "IMPOSSIBLE" << endl;
        return 0;
    }

    ss.push(0);
    while (!ss.empty()){
        ll v = ss.top();
        while (!ady[v].empty() && used[ady[v].back().id]) ady[v].pop_back();
        
        if(!ady[v].empty()){
            auto edge = ady[v].back(); ady[v].pop_back();
            used[edge.id] = true;
            ss.push(edge.to);
        }
        else{
            cycle.push_back(v);
            ss.pop();
        }
    }
    
    for(auto &x: cycle) cout << x+1 << " ";
    cout << endl;
}

