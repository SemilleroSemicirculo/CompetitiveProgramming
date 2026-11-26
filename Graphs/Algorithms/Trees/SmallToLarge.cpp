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
 * Algoritmo : Small to large (unir siempre el mapa chico en el grande: cada elemento se mueve O(log n) veces)
 * Problema  : Codeforces 600E - Lomsat gelral (https://codeforces.com/problemset/problem/600/E)
 * Entrada   : n; colores c_1 … c_n; n − 1 aristas (raíz 1)
 * Salida    : para cada nodo, la suma de los colores que más se repiten en su subárbol
 * Complejidad: tiempo O(n log² n) con map (O(n log n) inserciones), memoria O(n)
 */

int main() {
    fastio;
    int n;
    cin >> n;
    vector<int> c(n + 1);
    for (int i = 1; i <= n; i++) cin >> c[i];
    vector<vector<int>> g(n + 1);
    for (int i = 0; i < n - 1; i++) { int a, b; cin >> a >> b; g[a].push_back(b); g[b].push_back(a); }
    vector<int> par(n + 1, 0), orden, st = {1};
    par[1] = -1;
    while (!st.empty()) {
        int u = st.back(); st.pop_back(); orden.push_back(u);
        for (int v : g[u]) if (v != par[u]) par[v] = u, st.push_back(v);
    }
    // cada nodo es dueño de un mapa color → frecuencia, más el máximo y la suma de los colores máximos
    vector<map<int, int>*> mp(n + 1);
    vector<int> best(n + 1);
    vector<ll> suma(n + 1), res(n + 1);
    auto meter = [&](int u, int color, int k) {   // sumar k apariciones de color al mapa de u
        int f = ((*mp[u])[color] += k);
        if (f > best[u]) { best[u] = f; suma[u] = color; }
        else if (f == best[u]) suma[u] += color;
    };
    for (int i = n - 1; i >= 0; i--) {   // hijos antes que padres
        int u = orden[i];
        mp[u] = new map<int, int>();
        best[u] = 0; suma[u] = 0;
        meter(u, c[u], 1);
        for (int v : g[u]) {
            if (v == par[u]) continue;
            // quedarse con el mapa más grande y volcar el chico en él
            if (mp[v]->size() > mp[u]->size()) { swap(mp[u], mp[v]); swap(best[u], best[v]); swap(suma[u], suma[v]); }
            for (auto [color, k] : *mp[v]) meter(u, color, k);
            delete mp[v];
        }
        res[u] = suma[u];
    }
    for (int u = 1; u <= n; u++) cout << res[u] << " \n"[u == n];
    return 0;
}
