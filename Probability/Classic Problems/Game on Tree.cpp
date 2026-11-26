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
 * Algoritmo : Linealidad de la esperanza con indicadores (E = Σ 1 / profundidad)
 * Problema  : Codeforces 280C - Game on Tree (https://codeforces.com/problemset/problem/280/C)
 * Entrada   : n, luego n − 1 aristas del árbol con raíz 1
 * Salida    : número esperado de pasos del juego (error ≤ 10^-6)
 * Complejidad: tiempo O(n), memoria O(n)
 */

int main() {
    fastio;
    int n;
    cin >> n;
    vector<vector<int>> g(n + 1);
    for (int i = 0; i < n - 1; i++) {
        int a, b;
        cin >> a >> b;
        g[a].push_back(b), g[b].push_back(a);
    }
    // v se elige (cuenta un paso) solo si se escoge antes que todos sus ancestros.
    // Entre v y sus depth(v) − 1 ancestros, cada orden es igual de probable: P = 1 / depth(v).
    vector<int> depth(n + 1, 0);
    depth[1] = 1;
    vector<int> order = {1};
    double res = 0;
    for (int k = 0; k < (int)order.size(); k++) {
        int u = order[k];
        res += 1.0 / depth[u];
        for (int v : g[u]) if (!depth[v]) depth[v] = depth[u] + 1, order.push_back(v);
    }
    precision(12);
    cout << res << "\n";
    return 0;
}
