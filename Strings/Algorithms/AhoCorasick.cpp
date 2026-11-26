#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef long double ld;
const ll INF = numeric_limits<ll>::max() / 4;   // deja margen para INF + w sin desbordar

#define all(x) x.begin(), x.end()
#define rall(x) x.rbegin(), x.rend()
#define MOD 998244353
#define pi acos(-1)
#define gcd __gcd
inline ll lcm(ll a, ll b) { return a / __gcd(a, b) * b; }   // divide antes de multiplicar
#define precision(n) cout << fixed << setprecision(n)
#define debug(arr) do { cerr << #arr << " = "; for (auto &x : arr) cerr << x << " "; cerr << endl; } while (0)
#define fastio ios::sync_with_stdio(0); cin.tie(0); cout.tie(0);
/*
 * Algoritmo : Aho-Corasick (trie con enlaces de fallo: muchos patrones a la vez en tiempo lineal)
 * Problema  : CSES 2102 - Finding Patterns (https://cses.fi/problemset/task/2102)
 * Entrada   : el texto s; k; luego k patrones
 * Salida    : para cada patrón, YES si aparece en s y NO si no
 * Complejidad: tiempo O(|s| + Σ|p| · σ), memoria O(Σ|p| · σ) con σ = 26
 */

int main() {
    fastio;
    string s;
    int k;
    cin >> s >> k;
    vector<array<int, 26>> nxt(1);   // trie; nxt[u][c] se completa luego como autómata
    nxt[0].fill(-1);
    vector<int> fin(k);              // nodo donde termina cada patrón
    for (int i = 0; i < k; i++) {
        string p;
        cin >> p;
        int u = 0;
        for (char ch : p) {
            int c = ch - 'a';
            if (nxt[u][c] == -1) {
                nxt[u][c] = nxt.size();
                nxt.emplace_back();
                nxt.back().fill(-1);
            }
            u = nxt[u][c];
        }
        fin[i] = u;
    }
    int N = nxt.size();
    // link[u] = nodo del sufijo propio más largo de u que también está en el trie (como el
    // borde de KMP, pero para todos los patrones). Se calcula por niveles con BFS.
    vector<int> link(N, 0), orden;
    queue<int> q;
    for (int c = 0; c < 26; c++)
        if (nxt[0][c] == -1) nxt[0][c] = 0;
        else q.push(nxt[0][c]);
    while (!q.empty()) {
        int u = q.front(); q.pop();
        orden.push_back(u);
        for (int c = 0; c < 26; c++) {
            int v = nxt[u][c];
            if (v == -1) nxt[u][c] = nxt[link[u]][c];   // transición que falla: se hereda
            else { link[v] = nxt[link[u]][c]; q.push(v); }
        }
    }
    // recorrer el texto marcando los nodos visitados
    vector<int> visto(N, 0);
    int u = 0;
    for (char ch : s) { u = nxt[u][ch - 'a']; visto[u] = 1; }
    // si se visitó u, también aparecen todos sus sufijos: se propaga por los links, de los
    // nodos más profundos a los menos profundos (BFS al revés)
    for (int i = (int)orden.size() - 1; i >= 0; i--) visto[link[orden[i]]] |= visto[orden[i]];
    for (int i = 0; i < k; i++) cout << (visto[fin[i]] ? "YES" : "NO") << "\n";
    return 0;
}
