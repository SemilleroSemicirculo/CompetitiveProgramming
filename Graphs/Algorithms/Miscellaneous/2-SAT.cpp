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
 * Algoritmo : 2-SAT con componentes fuertemente conexas (Tarjan)
 * Problema  : CSES 1684 - Giant Pizza (https://cses.fi/problemset/task/1684)
 * Entrada   : n m, luego n líneas "+ a - b" (deseos de cada persona sobre m ingredientes)
 * Salida    : una asignación "+/-" por ingrediente, o IMPOSSIBLE
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
    // 2-SAT: n cláusulas y m variables; el nodo x es "x verdadero" y x+m es su negación
    Tarjan tarjan(2*m+1);
 
    // negación de un literal
    auto negation = [&](ll u){
        if(u > m) return u - m;
        else return u + m;
    };
 
    for(int i = 0; i < n; i++){
        // cada cláusula (a ∨ b) agrega las implicaciones ¬a → b y ¬b → a
        char type1, type2; ll u, v; 
        cin >> type1 >> u >> type2  >> v;
        // se lee "+ x" como literal x; se guarda su negación para armar las implicaciones
        if(type1 == '+') u = negation(u);
        if(type2 == '+') v = negation(v);
 
        tarjan.add_edge(negation(u), v);
        tarjan.add_edge(negation(v), u);
    }
 
    // SCC sobre el grafo de implicaciones
    for(int i = 1; i < 2*m+1; i++){
        if(tarjan.discovered[i] == -1){
            tarjan.DFS(i);
        }
    }
 
    // si x y ¬x están en la misma SCC no hay solución
    bool agg = true;
    for(int i = 1; i <= m; i++){
        if(tarjan.SCC_index[i] == tarjan.SCC_index[negation(i)]){
            agg = false;
            break;
        }
    }
 
    if(!agg){
        cout << "IMPOSSIBLE" << "\n";
    }
    else{
        // x es verdadera si su SCC sale después que la de ¬x en el orden topológico (Tarjan numera al revés)
        string res = "";
        for(int i = 1; i <= m; i++){
            if(tarjan.SCC_index[i] < tarjan.SCC_index[negation(i)]) res += '-';
            else res += '+';
        }
 
        for(auto c: res) cout << c << " ";
        cout << "\n";
    }
}
