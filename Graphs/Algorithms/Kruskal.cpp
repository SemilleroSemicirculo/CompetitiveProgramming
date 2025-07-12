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
    ll u, v, weight;
    Edge(ll u, ll v, ll w) : u(u), v(v), weight(w) {}
    
    bool operator<(const Edge& other) const {
        return weight < other.weight;
    }
};

vector<Edge> edges; // Grafo describiendo como lista de aristas
vector<ll> parents;
vector<ll> rank_arr;

ll find(ll x) {
    if (parents[x] != x) {
        parents[x] = find(parents[x]);
    }
    return parents[x];
}

void union_sets(ll x, ll y) {
    ll px = find(x);
    ll py = find(y);
    
    if (px != py) {
        if (rank_arr[px] < rank_arr[py]) {
            swap(px, py);
        }
        parents[py] = px;
        
        if (rank_arr[px] == rank_arr[py]) {
            rank_arr[px]++;
        }
    }
}

void initialize_dsu(ll size) {
    ll n = size;
    parents.resize(n);
    rank_arr.resize(n);
    
    for (ll i = 0; i < n; i++) {
        parents[i] = i;
        rank_arr[i] = 0;
    }
}

int main() {
    fastio;
    
    // Example usage with sample graph
    ll n = 6; // Número de vertices
    initialize_dsu(n);
    
    sort(edges.begin(), edges.end());
    
    int weight = 0;
    vector<Edge> MST;
    
    for (const Edge& edge : edges) {
        if (find(edge.u) != find(edge.v)) {
            weight += edge.weight;
            MST.push_back(edge);
            union_sets(edge.u, edge.v);
        }
    }

    return 0;
}
