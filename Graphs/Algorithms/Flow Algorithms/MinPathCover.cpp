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
 * Algoritmo : Cobertura mínima por caminos disjuntos en un DAG (n − emparejamiento máximo)
 * Problema  : Luogu P2764 - 最小路径覆盖问题 (https://www.luogu.com.cn/problem/P2764)
 * Entrada   : n m; m arcos "a b" de un DAG (1-indexado)
 * Salida    : cada camino en una línea (sus vértices en orden) y al final la cantidad mínima de caminos
 * Complejidad: tiempo O(n · m) con Kuhn, memoria O(n + m)
 */

// Cada vértice se parte en una copia "sale" (izquierda) y una "entra" (derecha); el arco a → b
// une sale(a) con entra(b). Cada pareja del emparejamiento pega dos caminos en uno:
// caminos = n − |emparejamiento|.
int n;
vector<vector<int>> g;
vector<int> matchR, matchL, vis;
int stamp = 0;
bool kuhn(int u) {
    for (int v : g[u]) {
        if (vis[v] == stamp) continue;
        vis[v] = stamp;
        if (matchR[v] == 0 || kuhn(matchR[v])) { matchR[v] = u; matchL[u] = v; return true; }
    }
    return false;
}

int main() {
    fastio;
    int m;
    cin >> n >> m;
    g.assign(n + 1, {});
    for (int i = 0; i < m; i++) { int a, b; cin >> a >> b; g[a].push_back(b); }
    matchR.assign(n + 1, 0); matchL.assign(n + 1, 0); vis.assign(n + 1, 0);
    int M = 0;
    for (int u = 1; u <= n; u++) { stamp++; if (kuhn(u)) M++; }
    // reconstruir: un camino empieza en cada vértice al que no entra nadie y sigue matchL
    for (int u = 1; u <= n; u++) {
        if (matchR[u]) continue;
        for (int x = u; x; x = matchL[x]) cout << x << " \n"[matchL[x] == 0];
    }
    cout << n - M << "\n";
    return 0;
}
