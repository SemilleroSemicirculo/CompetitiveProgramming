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
 * Algoritmo : Árbol de dominadores (Lengauer-Tarjan con DSU de compresión de caminos)
 * Problema  : Library Checker - Dominator Tree (https://judge.yosupo.jp/problem/dominatortree)
 * Entrada   : N M S; M arcos dirigidos "a b" (0-indexados); S es la raíz
 * Salida    : p_0 … p_{N−1}: el dominador inmediato de cada vértice (p_S = S; −1 si no es alcanzable)
 * Complejidad: tiempo O((N + M) log N), memoria O(N + M)
 */

// d domina a v si todo camino de S a v pasa por d. Con el orden DFS se calcula el semidominador
// sdom(v) = el vértice de menor orden desde el que se llega a v pasando solo por vértices posteriores;
// el dominador inmediato sale de comparar sdom a lo largo del camino del árbol DFS.
int main() {
    fastio;
    int n, m, S;
    cin >> n >> m >> S;
    vector<vector<int>> g(n), rg(n);
    for (int i = 0; i < m; i++) { int a, b; cin >> a >> b; g[a].push_back(b); rg[b].push_back(a); }
    vector<int> ord(n, -1), vert, par(n, -1);
    // DFS iterativo para numerar en preorden
    vector<pair<int, int>> st = {{S, 0}};
    ord[S] = 0; vert.push_back(S);
    while (!st.empty()) {
        auto &[u, i] = st.back();
        if (i < (int)g[u].size()) {
            int v = g[u][i++];
            if (ord[v] < 0) { ord[v] = vert.size(); vert.push_back(v); par[v] = u; st.push_back({v, 0}); }
        } else st.pop_back();
    }
    int k = vert.size();
    // todo en índices de preorden 0 … k − 1
    vector<int> sdom(k), idom(k), anc(k, -1), best(k);
    vector<vector<int>> bucket(k);
    iota(all(sdom), 0); iota(all(best), 0);
    // find con compresión: devuelve el vértice de menor sdom en el camino hasta la raíz del DSU
    function<int(int)> eval_ = [&](int v) {
        if (anc[v] < 0) return v;
        vector<int> camino;
        for (int x = v; anc[anc[x]] >= 0; x = anc[x]) camino.push_back(x);
        for (int i = (int)camino.size() - 1; i >= 0; i--) {
            int x = camino[i];
            if (sdom[best[anc[x]]] < sdom[best[x]]) best[x] = best[anc[x]];
            anc[x] = anc[anc[x]];
        }
        return best[v];
    };
    for (int w = k - 1; w > 0; w--) {
        int u = vert[w];
        for (int pv : rg[u]) {
            if (ord[pv] < 0) continue;
            int x = eval_(ord[pv]);
            sdom[w] = min(sdom[w], sdom[x]);
        }
        bucket[sdom[w]].push_back(w);
        int p = ord[par[u]];
        anc[w] = p;   // enlazar w con su padre DFS
        for (int v : bucket[p]) {
            int x = eval_(v);
            idom[v] = sdom[x] < sdom[v] ? x : p;   // provisional: se corrige abajo
        }
        bucket[p].clear();
    }
    for (int w = 1; w < k; w++) if (idom[w] != sdom[w]) idom[w] = idom[idom[w]];
    vector<int> res(n, -1);
    res[S] = S;
    for (int w = 1; w < k; w++) res[vert[w]] = vert[idom[w]];
    for (int i = 0; i < n; i++) cout << res[i] << " \n"[i == n - 1];
    return 0;
}
