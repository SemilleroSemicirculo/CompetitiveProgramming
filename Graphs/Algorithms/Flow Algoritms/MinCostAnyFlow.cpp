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

struct MinCostFlow {
    struct Edge { ll to, rev, cap, cost; };
    
    ll n;
    vector<vector<Edge>> adj;
    
    MinCostFlow(ll n=0): n(n), adj(n) {}

    ll add_edge(ll u, ll v, ll cap, ll cost){
        ll iu = adj[u].size();
        ll iv = adj[v].size();
        adj[u].push_back({v, iv, cap, cost});
        adj[v].push_back({u, iu, 0, -cost});
        return iu;
    }

    // try to send exactly K flow from s to t; returns {flow_sent, total_cost}
    pair<ll,ll> min_cost_flow_k(ll s, ll t, ll K){
        ll flow = 0, cost = 0;
        vector<ll> potential(n, 0), dist(n);
        vector<ll> parent_vertex(n), parent_edge(n);

        // init potentials with Bellman-Ford if negative edges exist (safe)
        for(int it = 0; it < n; ++it){
            bool any = false;
            for(int v = 0; v < n; ++v){
                if(potential[v] == INF) continue;
                for(auto &edge : adj[v]){
                    if(edge.cap > 0 && potential[edge.to] > potential[v] + edge.cost){
                        potential[edge.to] = potential[v] + edge.cost;
                        any = true;
                    }
                }
            }
            if(!any) break;
        }

        while(flow < K){
            fill(all(dist), INF); dist[s] = 0;

            priority_queue<pair<ll,int>, vector<pair<ll,int>>, greater<pair<ll,int>>> pq;
            pq.push({0, s});
            
            while(!pq.empty()){
                auto [dis, v] = pq.top(); pq.pop();
                if(dis != dist[v]) continue;
                for(int i = 0; i < adj[v].size(); ++i){
                    auto &edge = adj[v][i];
                    if(edge.cap <= 0) continue;
                    ll new_dis = dis + edge.cost + potential[v] - potential[edge.to];
                    if(new_dis < dist[edge.to]){
                        dist[edge.to] = new_dis;
                        parent_vertex[edge.to] = v;
                        parent_edge[edge.to] = i;
                        pq.push({new_dis, edge.to});
                    }
                }
            }
            if(dist[t] == INF) break; // cannot send more

            for(int v = 0; v < n; ++v)
                if(dist[v] < INF) potential[v] += dist[v];

            ll add = K - flow;
            int v = t;
            while(v != s){
                auto &edge = adj[parent_vertex[v]][parent_edge[v]];
                add = min(add, edge.cap);
                v = parent_vertex[v];
            }

            v = t;
            while(v != s){
                auto &edge = adj[parent_vertex[v]][parent_edge[v]];
                edge.cap -= add;
                adj[v][edge.rev].cap += add;
                v = parent_vertex[v];
            }

            flow += add;
            cost += add * potential[t]; // potential[t] equals actual shortest path cost
        }

        return {flow, cost};
    }
};

int main(){
    fastio;

    int n = 4;
    MinCostFlow mcf(n);
    vector<tuple<int,int,ll,ll,int>> edges; // store (u,v,cap,cost,idx)

    auto add = [&](int u,int v,ll cap,ll cost){
        int idx = mcf.add_edge(u,v,cap,cost);
        edges.emplace_back(u,v,cap,cost,idx);
    };

    add(0,1,3,1);
    add(0,2,2,2);
    add(1,2,1,0);
    add(1,3,2,3);
    add(2,3,4,1);

    ll K = 1; // desired flow
    auto [sent, total_cost] = mcf.min_cost_flow_k(0, 3, K);
    if(sent < K) {
        cout << "Impossible to send " << K << " units of flow. Sent: " << sent << "\n";
    } else {
        cout << "Sent " << sent << " units with min cost = " << total_cost << "\n";
    }

    // print flows on original edges
    cout << "Edge flows (u->v):\n";
    for(auto &tup : edges){
        int u,v,idx; ll cap,cost_e;
        tie(u,v,cap,cost_e,idx) = tup;
        ll remaining = mcf.adj[u][idx].cap;
        ll sent_on_edge = cap - remaining;
        cout << u << "->" << v << " sent=" << sent_on_edge << " (cap=" << cap << ", cost=" << cost_e << ")\n";
    }

    return 0;
}