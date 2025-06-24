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

int main() {
    ll n, m;
    cin >> n >> m;

    vector<vector<pll>> graph(n);

    for (ll i = 0; i < m; ++i) {
        ll a, b, w;
        cin >> a >> b >> w;
        graph[a-1].emplace_back(b-1, w);
        graph[b-1].emplace_back(a-1, w);
    }


    // Djikstra con complejidad O(n log(n)) usando heap
    vector<ll> dis(n, INF);
    vector<ll> parents(n, -1);

    ll root = 0;
    dis[root] = 0;

    priority_queue<pll, vector<pll>, greater<pll>> pq;
    pq.emplace(0, root);

    while (!pq.empty()) {
        ll d_v = pq.top().first;
        ll v = pq.top().second;
        pq.pop();

        if (d_v > dis[v]) continue;

        for (auto &[neighbor, weight] : graph[v]) {
            ll distance = d_v + weight;

            if (distance < dis[neighbor]) {
                dis[neighbor] = distance;
                parents[neighbor] = v;
                pq.emplace(distance, neighbor);
            }
        }
    }

    // Esto es para reconstruir el camino de root a destiny
    ll destiny = n-1;
    if(dis[destiny] == INF){
        cout << -1 << endl;
    }
    else{
        vector<ll> path;
        ll v = destiny;
        while (parents[v] != -1)
        {
            path.push_back(v+1);
            v = parents[v];            
        }
        path.push_back(root+1);
        reverse(path.begin(), path.end());

        for(auto &v: path){
            cout << v << " ";
        }
        cout << endl;
    }
}