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
 * Algoritmo : Emparejamiento bipartito máximo (algoritmo de Kuhn)
 * Problema  : CSES 1696 - School Dance (https://cses.fi/problemset/task/1696)
 * Entrada   : n m k, luego k pares "chico chica"
 * Salida    : cantidad máxima de parejas y las parejas
 * Complejidad: tiempo O(V · E), memoria O(V + E)
 */

int n, m;
vector<vector<int>> G;
// match[v] = nodo de la izquierda emparejado con v (0 si ninguno)
vector<int> match;  // match[chica] = chico emparejado (0 si ninguno)
vector<bool> used;

// busca un camino aumentante desde u
bool kuhn(int u) {
    for (int v : G[u]) {
        if (used[v]) continue;
        used[v] = true;
        // v está libre, o se puede reubicar a quien lo ocupa
        if (match[v] == 0 || kuhn(match[v])) {
            match[v] = u;
            return true;
        }
    }
    return false;
}

int main() {
    fastio;
    int k;
    cin >> n >> m >> k;
    G.assign(n + 1, {});
    match.assign(m + 1, 0);
    for (int i = 0; i < k; i++) {
        int a, b;
        cin >> a >> b;
        G[a].push_back(b);
    }

    int total = 0;
    // se intenta emparejar a cada nodo de la izquierda
    for (int u = 1; u <= n; u++) {
        // used evita visitar un nodo dos veces en la misma búsqueda
        used.assign(m + 1, false);
        if (kuhn(u)) total++;
    }

    cout << total << "\n";
    for (int v = 1; v <= m; v++)
        if (match[v]) cout << match[v] << ' ' << v << "\n";
    return 0;
}
