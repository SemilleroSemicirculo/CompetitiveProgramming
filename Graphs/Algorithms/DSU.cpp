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

vector<vector<ll>> G; // Algún grafo en lista de adyacencia
vector<ll> parents;

ll find(ll x) {
    if (parents[x] != x) {
        parents[x] = find(parents[x]); // Path compression
    }
    return parents[x];
}

void union_sets(ll x, ll y) {
    ll px = find(x);
    ll py = find(y);
    
    parents[px] = py;
}

void initialize_dsu(ll size) {
    ll n = size;
    parents.resize(n);
    for (int i = 0; i < n; i++) {
        parents[i] = i;
    }
}

int main() {
    fastio;
    
    // Example usage
    ll nodes = 6;
    initialize_dsu(nodes);
    
    return 0;
}
