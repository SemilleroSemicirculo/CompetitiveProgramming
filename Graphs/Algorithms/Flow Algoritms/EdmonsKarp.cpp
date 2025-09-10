#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef long double ld;
const ll INF = numeric_limits<ll>::max();

#define all(x) x.begin(), x.end()
#define rall(x) x.rbegin(), x.rend()
#define MOD 998244353
// #define MOD pow(10, 9)+7;
#define pi acos(-1)
#define gcd __gcd
#define lcm(a, b) ((a) * (b) / gcd(a, b))
#define precision(n) cout << fixed << setprecision(n)
#define debug(arr) cerr << #arr << " = "; for (auto &x : arr) cerr << x << " "; cerr << endl;
#define fastio ios::sync_with_stdio(0); cin.tie(0); cout.tie(0);

ll BFS(ll s, ll t, vector<ll> &parent, vector<vector<ll>> &ady, vector<vector<ll>> &capacity){
    fill(all(parent), -1);
    parent[s] = -2;
    queue<pair<ll, ll>> qq; qq.push({s, INF});

    while (!qq.empty()){
        auto [v, flow] = qq.front(); qq.pop();

        for(auto u: ady[v]){
            if(parent[u] == -1 && capacity[v][u]){
                parent[u] = v;
                ll new_flow = min(flow, capacity[v][u]);
                if(u == t) return new_flow;

                qq.push({u, new_flow});
            }
        }
    }
    return 0;
}

ll max_flow(ll s, ll t, vector<vector<ll>> &ady, vector<vector<ll>> &capacity){
    ll flow = 0, new_flow = 0;
    vector<ll> parent(ady.size());

    while (new_flow = BFS(s, t, parent, ady, capacity)){
        flow += new_flow;
        ll cur = t;
        while (cur != s){
            ll prev = parent[cur];
            capacity[prev][cur] -= new_flow;
            capacity[cur][prev] += new_flow;
            cur = prev;
        }   
    }
    
    return flow;
}

int main(){
    fastio;
    // Example graph:
    // 0 -> 1 (cap 3)
    // 0 -> 2 (cap 2)
    // 1 -> 2 (cap 1)
    // 1 -> 3 (cap 2)
    // 2 -> 3 (cap 4)
    //
    // Expected max flow from 0 to 3 = 4 (2 via 0-1-3 and 2 via 0-2-3)

    int n = 4;
    vector<vector<ll>> ady(n);
    vector<vector<ll>> capacity(n, vector<ll>(n, 0));
    vector<tuple<int,int,ll>> edges; // store original directed edges

    auto add_edge = [&](int u, int v, ll cap){
        ady[u].push_back(v);
        ady[v].push_back(u); // add reverse edge for residual graph
        capacity[u][v] = cap;
        edges.emplace_back(u, v, cap);
    };

    add_edge(0, 1, 3);
    add_edge(0, 2, 2);
    add_edge(1, 2, 1);
    add_edge(1, 3, 2);
    add_edge(2, 3, 4);

    // keep a copy of original capacities to compute flow on each edge later
    vector<vector<ll>> capacity_init = capacity;

    ll s = 0, t = 3;
    ll flow = max_flow(s, t, ady, capacity);
    cout << "Max flow from " << s << " to " << t << " = " << flow << '\n';

    // Print flow sent on each original edge and residual capacity
    cout << "Edge flows (u -> v):\n";
    for (auto &e : edges){
        int u, v; ll cap;
        tie(u, v, cap) = e;
        ll sent = capacity_init[u][v] - capacity[u][v]; // original - remaining
        cout << u << " -> " << v << " : sent = " << sent 
             << " (residual cap = " << capacity[u][v] << ")\n";
    }

    cout << "Residual capacity matrix:\n";
    for(int i = 0; i < n; ++i){
        for(int j = 0; j < n; ++j){
            cout << capacity[i][j] << (j+1==n?'\n':' ');
        }
    }
}