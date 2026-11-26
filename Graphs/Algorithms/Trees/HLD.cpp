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
 * Algoritmo : Descomposición heavy-light (HLD) + Segment Tree para consultas en caminos
 * Problema  : CSES 2134 - Path Queries II (https://cses.fi/problemset/task/2134)
 * Entrada   : n, q; valores v_1 … v_n; n − 1 aristas; consultas "1 s x" (v_s = x) o "2 a b"
 * Salida    : para cada consulta de tipo 2, el máximo valor en el camino de a a b
 * Complejidad: tiempo O((n + q) log² n), memoria O(n)
 */

int n;
vector<int> seg;   // Segment Tree iterativo de máximos sobre las posiciones pos[]

void actualizar(int i, int x) {
    for (seg[i += n] = x; i > 1; i >>= 1) seg[i >> 1] = max(seg[i], seg[i ^ 1]);
}
int consultar(int l, int r) {   // máximo en [l, r]
    int res = 0;
    for (l += n, r += n + 1; l < r; l >>= 1, r >>= 1) {
        if (l & 1) res = max(res, seg[l++]);
        if (r & 1) res = max(res, seg[--r]);
    }
    return res;
}

int main() {
    fastio;
    int q;
    cin >> n >> q;
    vector<int> val(n + 1);
    for (int i = 1; i <= n; i++) cin >> val[i];
    vector<vector<int>> g(n + 1);
    for (int i = 0; i < n - 1; i++) {
        int a, b;
        cin >> a >> b;
        g[a].push_back(b);
        g[b].push_back(a);
    }
    // 1) padre, profundidad, tamaño de subárbol e hijo pesado (el de subárbol más grande)
    vector<int> par(n + 1, 0), prof(n + 1, 0), sz(n + 1, 1), pesado(n + 1, 0), orden, st = {1};
    while (!st.empty()) {
        int u = st.back(); st.pop_back();
        orden.push_back(u);
        for (int v : g[u]) if (v != par[u]) par[v] = u, prof[v] = prof[u] + 1, st.push_back(v);
    }
    for (int i = n - 1; i > 0; i--) {
        int u = orden[i], p = par[u];
        sz[p] += sz[u];
        if (!pesado[p] || sz[u] > sz[pesado[p]]) pesado[p] = u;
    }
    // 2) cadenas: cada nodo apunta a la cabeza de su cadena pesada; las posiciones de una
    //    cadena quedan consecutivas, así un tramo de cadena es un rango del Segment Tree
    vector<int> cabeza(n + 1), pos(n + 1);
    int t = 0;
    for (int u : orden)
        if (par[u] == 0 || pesado[par[u]] != u)   // u empieza una cadena nueva
            for (int v = u; v; v = pesado[v]) cabeza[v] = u, pos[v] = t++;
    seg.assign(2 * n, 0);
    for (int u = 1; u <= n; u++) seg[n + pos[u]] = val[u];
    for (int i = n - 1; i > 0; i--) seg[i] = max(seg[2 * i], seg[2 * i + 1]);
    while (q--) {
        int tipo, a, b;
        cin >> tipo >> a >> b;
        if (tipo == 1) { actualizar(pos[a], b); continue; }
        int res = 0;
        // se sube siempre desde la cadena cuya cabeza es más profunda; cada salto de cadena
        // cruza una arista liviana, y hay O(log n) de esas en cualquier camino
        while (cabeza[a] != cabeza[b]) {
            if (prof[cabeza[a]] < prof[cabeza[b]]) swap(a, b);
            res = max(res, consultar(pos[cabeza[a]], pos[a]));
            a = par[cabeza[a]];
        }
        if (prof[a] > prof[b]) swap(a, b);
        res = max(res, consultar(pos[a], pos[b]));   // ya en la misma cadena
        cout << res << " \n"[q == 0];
    }
    return 0;
}
