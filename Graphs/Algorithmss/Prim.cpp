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

struct Edge {
    ll v, weight;
    Edge(ll v, ll w) : v(v), weight(w) {}
};


int main() {
    fastio;
    ll n = 5;
    vector<vector<Edge>> G;
    
    // Example usage with sample graph
    ll start = 0;
    ll mst_weight = 0;
    
    vector<bool> visited(n, false);
    vector<ll> key(n, INF);
    vector<ll> parent(n);
    
    // Initialize parent array
    for (int i = 0; i < n; i++) {
        parent[i] = i;
    }
    
    // Min heap: (weight, vertex)
    priority_queue<pair<ll, ll>, vector<pair<ll, ll>>, greater<pair<ll, ll>>> pq;
    
    pq.push({0, start});
    key[start] = 0;
    
    while (!pq.empty()) {
        ll w = pq.top().first;
        ll u = pq.top().second;
        pq.pop();
        
        if (visited[u]) {
            continue;
        }
        
        visited[u] = true;
        mst_weight += w;
        
        for (const Edge& edge : G[u]) {
            ll v = edge.v;
            ll weight = edge.weight;
                        
            if (!visited[v] && weight < key[v]) {
                key[v] = weight;
                parent[v] = u;
                pq.push({key[v], v});
            }
        }
    }
    
    // Build MST edges
    vector<tuple<ll, ll, ll>> MST;
    for (ll i = 0; i < n; i++) {
        if (parent[i] != i) {
            MST.push_back({i, parent[i], key[i]});
        }
    }
}
