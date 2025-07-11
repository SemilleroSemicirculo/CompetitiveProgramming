#include <bits/stdc++.h>
#include <iomanip>

using namespace std;

typedef long long int ll;
typedef pair<ll, ll> pll;
typedef tuple<ll, ll, ll> triple;
const ll INF = numeric_limits<ll>::max();

template <typename ele_type>
ostream& operator<<(ostream& os, const vector<ele_type>& vect_name){
  for(auto itr: vect_name){
    os << itr << " ";
  }
  return os;
}

int main(){
    ll n, m; cin >> n >> m;
    vector<vector<ll>> G(n, vector<ll>());
    
    for(int i = 0; i < m; i++){
        ll u, v; cin >> u >> v;
        u--; v--;
        G[u].push_back(v);
        G[v].push_back(u);
    }

    ll root = 0;

    queue<ll> qq;
    vector<ll> distance(n, INF);

    qq.push(root);
    distance[root] = 0;
    while (!qq.empty())
    {
        ll v = qq.front(); qq.pop();
        
        for(auto u: G[v]){
            if(distance[u] == INF){
                distance[u] = distance[v] + 1;
                qq.push(u);
            }
        }
    }
}