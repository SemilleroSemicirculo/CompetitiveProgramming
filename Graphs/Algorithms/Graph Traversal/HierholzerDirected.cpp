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
 * Algoritmo : Camino euleriano en grafo dirigido (Hierholzer)
 * Problema  : CSES 1693 - Teleporters Path (https://cses.fi/problemset/task/1693)
 * Entrada   : n m, luego m aristas dirigidas "a b"
 * Salida    : un camino de 1 a n que usa cada arista exactamente una vez, o IMPOSSIBLE
 * Complejidad: tiempo O(n + m), memoria O(n + m)
 */

int main() {
    fastio;
    int n, m;
    cin >> n >> m;
    vector<vector<int>> G(n + 1);
    // grados de entrada y salida de cada nodo
    vector<int> in(n + 1, 0), out(n + 1, 0);
    for (int i = 0; i < m; i++) {
        int a, b;
        cin >> a >> b;
        G[a].push_back(b);
        out[a]++, in[b]++;
    }

    // condiciones del camino de 1 a n
    // el camino de 1 a n existe si out(1) = in(1) + 1, in(n) = out(n) + 1 y los demás grados coinciden
    bool ok = out[1] - in[1] == 1 && in[n] - out[n] == 1;
    for (int i = 2; i < n; i++) ok &= in[i] == out[i];
    if (!ok) {
        cout << "IMPOSSIBLE\n";
        return 0;
    }

    // Hierholzer iterativo
    vector<int> path, st = {1};
    while (!st.empty()) {
        int u = st.back();
        if (G[u].empty()) {
            path.push_back(u);
            st.pop_back();
        }
        else {
            int v = G[u].back();
            G[u].pop_back();
            st.push_back(v);
        }
    }
    reverse(all(path));

    // si no se usaron las m aristas, el grafo no es conexo
    if ((int)path.size() != m + 1 || path[0] != 1 || path.back() != n) {
        cout << "IMPOSSIBLE\n";
        return 0;
    }
    for (int v : path) cout << v << ' ';
    cout << "\n";
    return 0;
}
