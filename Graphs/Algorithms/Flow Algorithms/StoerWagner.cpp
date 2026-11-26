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
 * Algoritmo : Stoer-Wagner (corte mínimo global de un grafo no dirigido, sin fuente ni sumidero). Basado en KACTL (CC0)
 * Problema  : POJ 2914 - Minimum Cut (http://poj.org/problem?id=2914)
 * Entrada   : varios casos hasta fin de archivo; cada uno N M y M aristas "a b c" (0-indexadas, puede haber repetidas)
 * Salida    : para cada caso, el peso mínimo de aristas a quitar para desconectar el grafo
 * Complejidad: tiempo O(N³), memoria O(N²)
 */

// En cada fase se agregan vértices por "más conectado al conjunto"; los dos últimos (s, t)
// cumplen que w(t) es un corte mínimo entre s y t. Luego se fusionan s y t y se repite.
ll stoerWagner(vector<vector<ll>> mat) {
    int n = mat.size();
    ll best = INF;
    vector<bool> vivo(n, true);
    for (int fase = 1; fase < n; fase++) {
        vector<ll> w(n, 0);
        vector<bool> dentro(n, false);
        int s = -1, t = -1;
        for (int it = 0; it < n - fase + 1; it++) {
            int u = -1;
            for (int v = 0; v < n; v++) if (vivo[v] && !dentro[v] && (u < 0 || w[v] > w[u])) u = v;
            dentro[u] = true; s = t; t = u;
            for (int v = 0; v < n; v++) if (vivo[v] && !dentro[v]) w[v] += mat[u][v];
        }
        best = min(best, w[t]);                         // corte de la fase: t contra el resto
        for (int v = 0; v < n; v++) mat[s][v] += mat[t][v], mat[v][s] = mat[s][v];   // fusionar t en s
        vivo[t] = false;
    }
    return best;
}

int main() {
    fastio;
    int n, m;
    while (cin >> n >> m) {
        vector<vector<ll>> mat(n, vector<ll>(n, 0));
        for (int i = 0; i < m; i++) {
            int a, b; ll c;
            cin >> a >> b >> c;
            if (a != b) mat[a][b] += c, mat[b][a] += c;
        }
        cout << (n == 1 ? 0 : stoerWagner(mat)) << "\n";
    }
    return 0;
}
