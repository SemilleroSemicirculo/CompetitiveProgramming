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
 * Algoritmo : Árbol virtual (comprimir el árbol a los nodos de una consulta y sus LCA) + DP
 * Problema  : Codeforces 613D - Kingdom and its Cities (https://codeforces.com/problemset/problem/613/D)
 * Entrada   : n; n − 1 aristas; q; cada consulta: k y k ciudades importantes
 * Salida    : el mínimo de ciudades no importantes a capturar para separar todas las importantes, o -1
 * Complejidad: tiempo O((n + Σk) log n), memoria O(n log n)
 */

int n, LOG;
vector<vector<int>> g, up;
vector<int> tin, dep;

int lca(int a, int b) {
    if (dep[a] < dep[b]) swap(a, b);
    for (int j = LOG - 1; j >= 0; j--) if (dep[a] - (1 << j) >= dep[b]) a = up[j][a];
    if (a == b) return a;
    for (int j = LOG - 1; j >= 0; j--) if (up[j][a] != up[j][b]) a = up[j][a], b = up[j][b];
    return up[0][a];
}

int main() {
    fastio;
    cin >> n;
    g.assign(n + 1, {});
    for (int i = 0; i < n - 1; i++) { int a, b; cin >> a >> b; g[a].push_back(b); g[b].push_back(a); }
    LOG = 1; while ((1 << LOG) <= n) LOG++;
    up.assign(LOG, vector<int>(n + 1, 1));
    tin.assign(n + 1, 0); dep.assign(n + 1, 0);
    int t = 0;
    vector<int> st = {1}, it(n + 1, 0);
    tin[1] = t++;
    while (!st.empty()) {   // DFS iterativo para tin, profundidad y padre
        int u = st.back();
        if (it[u] < (int)g[u].size()) {
            int v = g[u][it[u]++];
            if (v == up[0][u] && u != 1) continue;
            if (v == 1) continue;
            up[0][v] = u; dep[v] = dep[u] + 1; tin[v] = t++; st.push_back(v);
        } else st.pop_back();
    }
    for (int j = 1; j < LOG; j++) for (int v = 1; v <= n; v++) up[j][v] = up[j - 1][up[j - 1][v]];
    vector<char> imp(n + 1, 0);
    vector<vector<int>> vt(n + 1);   // hijos en el árbol virtual
    int q;
    cin >> q;
    while (q--) {
        int k;
        cin >> k;
        vector<int> a(k);
        for (int &x : a) { cin >> x; imp[x] = 1; }
        bool malo = false;
        for (int x : a) if (x != 1 && imp[up[0][x]]) malo = true;   // dos importantes vecinas
        if (malo) { cout << -1 << "\n"; for (int x : a) imp[x] = 0; continue; }
        // nodos del árbol virtual: las importantes y los LCA de vecinas en orden de tin
        sort(all(a), [&](int x, int y) { return tin[x] < tin[y]; });
        vector<int> nodos = a;
        for (int i = 0; i + 1 < k; i++) nodos.push_back(lca(a[i], a[i + 1]));
        nodos.push_back(1);
        sort(all(nodos), [&](int x, int y) { return tin[x] < tin[y]; });
        nodos.erase(unique(all(nodos)), nodos.end());
        // con una pila se arma el árbol: el padre virtual de cada nodo es el anterior que es su ancestro
        vector<int> pila;
        for (int v : nodos) {
            while (!pila.empty() && lca(pila.back(), v) != pila.back()) pila.pop_back();
            if (!pila.empty()) vt[pila.back()].push_back(v);
            pila.push_back(v);
        }
        // DP de abajo hacia arriba: cnt[v] = ¿sube una importante sin separar desde v?
        int ans = 0;
        vector<int> cnt(nodos.size());
        map<int, int> idx;
        for (int i = 0; i < (int)nodos.size(); i++) idx[nodos[i]] = i;
        for (int i = (int)nodos.size() - 1; i >= 0; i--) {
            int v = nodos[i], sube = 0;
            for (int w : vt[v]) sube += cnt[idx[w]];
            if (imp[v]) { ans += sube; cnt[i] = 1; }        // cortar cada camino que llega a v
            else if (sube >= 2) { ans += 1; cnt[i] = 0; }   // capturar v separa a todos los de abajo
            else cnt[i] = sube;
        }
        cout << ans << "\n";
        for (int v : nodos) vt[v].clear();
        for (int x : a) imp[x] = 0;
    }
    return 0;
}
