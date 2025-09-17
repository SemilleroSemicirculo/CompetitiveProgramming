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
 
struct Tarjan{
    ll tempo = 0;
    vector<vector<ll>> ady;
    vector<ll> discovered;
    vector<ll> low;
    stack<ll> ss;
    vector<bool> in_stack;
    vector<vector<ll>> SCC;
    vector<ll> SCC_index;
 
    Tarjan(ll n){
        ady.assign(n, vector<ll>());
        discovered.assign(n, -1);
        low.assign(n, -1);
        in_stack.assign(n, false);
        SCC_index.assign(n, -1);
    }
 
    void add_edge(ll u, ll v){
        ady[u].push_back(v);
    }
 
    void DFS(ll v){
        discovered[v] = tempo;
        low[v] = tempo;
        tempo++;
 
        ss.push(v);
        in_stack[v] = true;
 
        for(auto u: ady[v]){
            if(discovered[u] == -1){
                DFS(u);
                low[v] = min(low[v], low[u]);
            }
            else if(in_stack[u]){
                low[v] = min(low[v], discovered[u]);
            }
        }
 
        if(low[v] == discovered[v]){
            vector<ll> newSCC;
            ll w;
            do {
                w = ss.top(); ss.pop();
                SCC_index[w] = SCC.size();
                newSCC.push_back(w);
                in_stack[w] = false;
            } while (w != v);
            SCC.push_back(newSCC);
        }
    }
};
 
int main(){
    fastio;
    
    ll n, m; cin >> n >> m;
    Tarjan tarjan(n);
 
    for(int i = 0; i < m; i++){
        ll u, v; cin >> u >> v;
        u--; v--;
        tarjan.add_edge(u, v);
    }
 
    for(int i = 0; i < n; i++){
        if(tarjan.discovered[i] == -1){
            tarjan.DFS(i);
        }
    }
 
    if(tarjan.SCC.size() == 1){
        cout << "YES" << endl;
    }
    else{
        cout << "NO" << endl;
        for(int i = 0; i < n; i++){
            for(auto j: tarjan.ady[i]){
                if(tarjan.SCC_index[i] != tarjan.SCC_index[j]){
                    cout << j+1 << " " << i+1 << endl;
                    return 0;
                }
            }
        }
 
        for(int i = 0; i < n; i++){
            if(tarjan.SCC_index[i] != 0){
                cout << i+1 << " " << tarjan.SCC.front().front() << endl;
                return 0; 
            }
        }
    }
}
