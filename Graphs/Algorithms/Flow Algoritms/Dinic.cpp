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

struct Dinic {
    struct Edge { 
        ll to; size_t rev_index; ll capacity;            
    };

    ll n;
    vector<vector<Edge>> adj;
    vector<ll> level;
    vector<ll> it;

    Dinic(ll n=0): n(n), adj(n), level(n), it(n) {}

    ll add_edge(ll u, ll v, ll cap){
        Edge a{v, adj[v].size(), cap};
        Edge b{u, adj[u].size(), 0};
        adj[u].push_back(a);
        adj[v].push_back(b);
        return adj[u].size() - 1; // index of forward edge in adj[u]
    }

    bool bfs(ll s, ll t){
        fill(all(level), -1); 
        level[s] = 0;

        queue<ll> q; q.push(s);
        while(!q.empty()){
            int v = q.front(); q.pop();
            for(auto &edge : adj[v]){
                if(level[edge.to] < 0 && edge.capacity > 0){
                    level[edge.to] = level[v] + 1;
                    q.push(edge.to);
                }
            }
        }
        return level[t] >= 0;
    }

    ll dfs(ll v, ll t, ll pushed){
        if(v == t || pushed == 0) return pushed;

        for(ll i = it[v]; i < adj[v].size(); ++i){
            Edge &edge = adj[v][i];

            if(level[edge.to] != level[v] + 1 || edge.capacity == 0) continue;
            
            ll tr = dfs(edge.to, t, min(pushed, edge.capacity));
            if(tr == 0) continue;

            edge.capacity -= tr;
            adj[edge.to][edge.rev_index].capacity += tr;
            return tr;
        }
        return 0;
    }

    ll max_flow(ll s, ll t){
        ll flow = 0;
        while(bfs(s,t)){
            fill(it.begin(), it.end(), 0);
            while(ll pushed = dfs(s,t, INF)) flow += pushed;
        }
        return flow;
    }
};

int main(){
    fastio;
    // Example graph (same as before)
    // 0 -> 1 (cap 3)
    // 0 -> 2 (cap 2)
    // 1 -> 2 (cap 1)
    // 1 -> 3 (cap 2)
    // 2 -> 3 (cap 4)
    //
    // Max flow from 0 to 3 should be 5.

    ll n = 4;
    Dinic dinic(n);
    vector<tuple<ll,ll,ll,ll>> edges; // (u,v,cap, idx_in_adj_u)

    auto add_edge = [&](ll u, ll v, ll cap){
        int idx = dinic.add_edge(u, v, cap);
        edges.emplace_back(u, v, cap, idx);
    };

    add_edge(0, 1, 3);
    add_edge(0, 2, 2);
    add_edge(1, 2, 1);
    add_edge(1, 3, 2);
    add_edge(2, 3, 4);

    // keep a copy of original capacities to compute flow on each edge later
    vector<vector<ll>> capacity_init(n, vector<ll>(n, 0));
    for(auto &t : edges){
        int u,v; ll cap; int idx; tie(u,v,cap,idx) = t;
        capacity_init[u][v] = cap;
    }

    int s = 0, t = 3;
    ll flow = dinic.max_flow(s, t);
    cout << "Max flow from " << s << " to " << t << " = " << flow << '\n';

    // Print flow sent on each original edge and residual capacity
    cout << "Edge flows (u -> v):\n";
    for (auto &e : edges){
        int u, v; ll cap; int idx;
        tie(u, v, cap, idx) = e;
        ll remaining = dinic.adj[u][idx].capacity;         // remaining capacity on forward edge
        ll sent = cap - remaining;                    // flow sent
        cout << u << " -> " << v << " : sent = " << sent 
             << " (residual cap = " << remaining << ")\n";
    }

    // Print full residual capacity matrix
    cout << "Residual capacity matrix:\n";
    vector<vector<ll>> residual(n, vector<ll>(n, 0));
    for(int u = 0; u < n; ++u){
        for(auto &ed : dinic.adj[u]){
            residual[u][ed.to] += ed.capacity; // note: multiple edges could exist
        }
    }
    for(int i = 0; i < n; ++i){
        for(int j = 0; j < n; ++j){
            cout << residual[i][j] << (j+1==n?'\n':' ');
        }
    }

    return 0;
}