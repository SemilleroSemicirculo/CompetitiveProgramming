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
 * Algoritmo : DP en árboles (dos estados por nodo: libre o emparejado con un hijo)
 * Problema  : CSES 1130 - Tree Matching (https://cses.fi/problemset/task/1130)
 * Entrada   : n; luego n − 1 aristas a b del árbol
 * Salida    : el máximo número de parejas de nodos vecinos sin repetir nodos (emparejamiento máximo)
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
        g[a].push_back(b);
        g[b].push_back(a);
    }
    // orden DFS desde 1 con pila; al recorrerlo al revés, los hijos van antes que el padre
    vector<int> orden, par(n + 1, 0);
    vector<int> st = {1};
    par[1] = -1;
    while (!st.empty()) {
        int u = st.back(); st.pop_back();
        orden.push_back(u);
        for (int v : g[u]) if (v != par[u]) par[v] = u, st.push_back(v);
    }
    // libre[u]: mejor en el subárbol de u sin usar u; usado[u]: mejor usando u con algún hijo
    vector<ll> libre(n + 1, 0), usado(n + 1, 0);
    for (int i = n - 1; i >= 0; i--) {
        int u = orden[i];
        ll suma = 0;
        for (int v : g[u]) if (v != par[u]) suma += max(libre[v], usado[v]);
        libre[u] = suma;
        // emparejar u con el hijo v: v debe quedar libre en su subárbol
        for (int v : g[u]) if (v != par[u])
            usado[u] = max(usado[u], suma - max(libre[v], usado[v]) + libre[v] + 1);
    }
    cout << max(libre[1], usado[1]) << "\n";
    return 0;
}
