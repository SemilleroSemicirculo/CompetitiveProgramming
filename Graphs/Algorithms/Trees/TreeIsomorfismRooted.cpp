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
 * Algoritmo : Isomorfismo de árboles con raíz (ids canónicos compartidos)
 * Problema  : CSES 1700 - Tree Isomorphism I (https://cses.fi/problemset/task/1700)
 * Entrada   : t casos: n, luego n-1 aristas del primer árbol y n-1 del segundo (ambos con raíz 1)
 * Salida    : YES si los árboles con raíz son isomorfos, NO si no
 * Complejidad: tiempo O(n log n), memoria O(n)
 */

// cada lista ordenada de ids de hijos recibe un id único
map<vector<int>, int> ids;  // compartido entre los dos árboles de cada caso

// id canónico de cada nodo: depende de los ids ordenados de sus hijos
// calcula el id canónico de la raíz del árbol
int canonical(const vector<vector<int>> &G) {
    int n = G.size() - 1;
    // BFS para obtener un orden y el padre de cada nodo
    vector<int> parent(n + 1, 0), order;
    order.push_back(1);
    for (int i = 0; i < (int)order.size(); i++) {
        int u = order[i];
        for (int v : G[u])
            if (v != parent[u]) {
                parent[v] = u;
                order.push_back(v);
            }
    }

    vector<int> id(n + 1);
    vector<vector<int>> children(n + 1);
    // se procesa de las hojas hacia la raíz
    for (int i = n - 1; i >= 0; i--) {  // de las hojas hacia la raíz
        int u = order[i];
        sort(all(children[u]));
        auto it = ids.find(children[u]);
        if (it == ids.end()) it = ids.insert({children[u], (int)ids.size()}).first;
        id[u] = it->second;
        if (parent[u]) children[parent[u]].push_back(id[u]);
    }
    return id[1];
}

int main() {
    fastio;
    int t;
    cin >> t;
    while (t--) {
        int n;
        cin >> n;
        vector<vector<int>> A(n + 1), B(n + 1);
        for (int i = 0; i < n - 1; i++) {
            int a, b;
            cin >> a >> b;
            A[a].push_back(b);
            A[b].push_back(a);
        }
        for (int i = 0; i < n - 1; i++) {
            int a, b;
            cin >> a >> b;
            B[a].push_back(b);
            B[b].push_back(a);
        }
        // árboles con raíz isomorfos si las raíces tienen el mismo id
        cout << (canonical(A) == canonical(B) ? "YES" : "NO") << "\n";
    }
    return 0;
}
