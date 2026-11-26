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
 * Algoritmo : Emparejamiento máximo en grafos generales (algoritmo de Edmonds con contracción de flores)
 * Problema  : Library Checker - Matching on General Graph (https://judge.yosupo.jp/problem/general_matching)
 * Entrada   : N M; M aristas "u v" (0-indexadas)
 * Salida    : K, el tamaño del emparejamiento máximo, y K líneas "u v" con sus aristas
 * Complejidad: tiempo O(N³), memoria O(N + M)
 */

// Desde cada vértice libre se hace BFS alternante. Un ciclo impar (flor) se contrae a su base:
// todos sus vértices pasan a ser "pares" y la búsqueda sigue como si fuera un solo vértice.
int n;
vector<vector<int>> g;
vector<int> mate, padre, base, tipo;   // tipo: -1 sin visitar, 0 par, 1 impar
queue<int> q;

int lcaFlor(int a, int b) {   // primer ancestro común en el árbol alternante (por bases)
    vector<bool> marca(n, false);
    while (true) {
        a = base[a]; marca[a] = true;
        if (mate[a] < 0) break;
        a = padre[mate[a]];
    }
    while (true) {
        b = base[b];
        if (marca[b]) return b;
        b = padre[mate[b]];
    }
}
void marcarCamino(int v, int b, int hijo, vector<bool> &enFlor) {
    while (base[v] != b) {
        enFlor[base[v]] = enFlor[base[mate[v]]] = true;
        padre[v] = hijo; hijo = mate[v];
        v = padre[mate[v]];
    }
}
bool buscar(int raiz) {
    fill(all(tipo), -1); fill(all(padre), -1);
    iota(all(base), 0);
    q = queue<int>();
    tipo[raiz] = 0; q.push(raiz);
    while (!q.empty()) {
        int v = q.front(); q.pop();
        for (int u : g[v]) {
            if (base[v] == base[u] || mate[v] == u) continue;
            if (u == raiz || (mate[u] >= 0 && padre[mate[u]] >= 0)) {   // u es par: se cerró un ciclo impar
                int b = lcaFlor(v, u);
                vector<bool> enFlor(n, false);
                marcarCamino(v, b, u, enFlor);
                marcarCamino(u, b, v, enFlor);
                for (int i = 0; i < n; i++) if (enFlor[base[i]]) {
                    base[i] = b;
                    if (tipo[i] != 0) tipo[i] = 0, q.push(i);
                }
            } else if (padre[u] < 0) {
                padre[u] = v;
                if (mate[u] < 0) {                    // camino aumentante: invertirlo
                    while (u >= 0) { int pv = padre[u], ppv = mate[pv]; mate[u] = pv; mate[pv] = u; u = ppv; }
                    return true;
                }
                tipo[mate[u]] = 0; q.push(mate[u]);
            }
        }
    }
    return false;
}

int main() {
    fastio;
    int m;
    cin >> n >> m;
    g.assign(n, {});
    for (int i = 0; i < m; i++) { int u, v; cin >> u >> v; if (u != v) g[u].push_back(v), g[v].push_back(u); }
    mate.assign(n, -1); padre.assign(n, -1); base.assign(n, 0); tipo.assign(n, -1);
    // arranque voraz: casi todo el emparejamiento sale sin búsquedas
    for (int v = 0; v < n; v++) if (mate[v] < 0) for (int u : g[v]) if (mate[u] < 0) { mate[u] = v; mate[v] = u; break; }
    for (int v = 0; v < n; v++) if (mate[v] < 0) buscar(v);
    vector<pair<int, int>> res;
    for (int v = 0; v < n; v++) if (mate[v] > v) res.push_back({v, mate[v]});
    cout << res.size() << "\n";
    for (auto [a, b] : res) cout << a << " " << b << "\n";
    return 0;
}
