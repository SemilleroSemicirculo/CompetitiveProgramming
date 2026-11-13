#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef long double ld;
const ll INF = numeric_limits<ll>::max();

#define all(x) x.begin(), x.end()
#define rall(x) x.rbegin(), x.rend()
#define MOD 998244353
#define pi acos(-1)
#define gcd __gcd
#define lcm(a, b) ((a) * (b) / gcd(a, b))
#define precision(n) cout << fixed << setprecision(n)
#define debug(arr) cerr << #arr << " = "; for (auto &x : arr) cerr << x << " "; cerr << endl;
#define fastio ios::sync_with_stdio(0); cin.tie(0); cout.tie(0);

/*
 * Algoritmo : Componentes fuertemente conexas (Tarjan)
 * Problema  : CSES 1682 - Flight Routes Check (https://cses.fi/problemset/task/1682)
 * Entrada   : n m, luego m aristas dirigidas "a b"
 * Salida    : YES si todo nodo llega a todo nodo; si no, NO y un par "a b" sin camino de a hacia b
 * Complejidad: tiempo O(n + m), memoria O(n + m)
 */

// Tarjan: componentes fuertemente conexas (SCC) con una sola DFS
struct Tarjan{
    // tempo = contador de descubrimiento
    ll tempo = 0;
    vector<vector<ll>> ady;
    // discovered[v] = momento en que se visitó v, low[v] = menor tiempo alcanzable desde su subárbol
    vector<ll> discovered;
    vector<ll> low;
    // pila de nodos de la SCC actual; in_stack evita usar aristas hacia SCC ya cerradas
    stack<ll> ss;
    vector<bool> in_stack;
    // SCC = lista de componentes, SCC_index[v] = componente de v
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
 
    // DFS de Tarjan
    void DFS(ll v){
        discovered[v] = tempo;
        low[v] = tempo;
        tempo++;
 
        ss.push(v);
        in_stack[v] = true;
 
        for(auto u: ady[v]){
            // arista de árbol: se baja y se actualiza low con el hijo
            if(discovered[u] == -1){
                DFS(u);
                low[v] = min(low[v], low[u]);
            }
            // arista hacia atrás dentro de la misma componente
            else if(in_stack[u]){
                low[v] = min(low[v], discovered[u]);
            }
        }
 
        // v es la raíz de una SCC: se desapila hasta v
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
    // se leen n nodos y m aristas dirigidas
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
 
    // una sola SCC = fuertemente conexo
    if(tarjan.SCC.size() == 1){
        cout << "YES" << "\n";
    }
    else{
        // hay que mostrar un par (a, b) tal que no se pueda ir de a a b
        cout << "NO" << "\n";
        for(int i = 0; i < n; i++){
            for(auto j: tarjan.ady[i]){
                // una arista i->j entre componentes distintas: no existe camino de j a i
                if(tarjan.SCC_index[i] != tarjan.SCC_index[j]){
                    cout << j+1 << " " << i+1 << "\n";
                    return 0;
                }
            }
        }
 
        for(int i = 0; i < n; i++){
            // si no, algún nodo no está en la componente 0: no se llega a ella desde ahí
            if(tarjan.SCC_index[i] != 0){
                cout << i+1 << " " << tarjan.SCC.front().front()+1 << "\n";
                return 0; 
            }
        }
    }
}
