#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef long double ld;
const ll INF = numeric_limits<ll>::max();

#define all(x) x.begin(), x.end()
#define rall(x) x.rbegin(), x.rend()
#define MOD 998244353
// #define MOD pow(10, 9)+7;
// #define MOD 3245284303;
#define pi acos(-1)
#define gcd __gcd
#define lcm(a, b) ((a) * (b) / gcd(a, b))
#define precision(n) cout << fixed << setprecision(n)
#define debug(arr) cerr << #arr << " = "; for (auto &x : arr) cerr << x << " "; cerr << endl;
#define fastio ios::sync_with_stdio(0); cin.tie(0); cout.tie(0);

const int MAXN = 100000 + 1;

int n, cidCounter;
// adj[t][u] = lista de vecinos del nodo u en el árbol t (t=0,1)
vector<int> adj[2][MAXN];
// sizeSub[t][u] = tamaño del subárbol en u en el árbol t
int sizeSub[2][MAXN];
// canonId[t][u] = identificador canónico del subárbol en u
int canonId[2][MAXN];
// posibles centroides de cada árbol
vector<int> centers[2];
// mapa de vectores de hijos ordenados → nuevo ID
map<vector<int>, int> idmap;

// Restaurar estructuras entre casos
void reset() {
    idmap.clear();
    cidCounter = 0;
    for (int t = 0; t < 2; t++) {
        centers[t].clear();
        for (int i = 1; i <= n; i++) {
            adj[t][i].clear();
            sizeSub[t][i] = canonId[t][i] = 0;
        }
    }
}

// DFS para hallar centroides: marca u si ningún subárbol > n/2
void dfs_centroid(int t, int u, int p) {
    sizeSub[t][u] = 1;
    bool ok = true;
    for (int v : adj[t][u]) if (v != p) {
        dfs_centroid(t, v, u);
        sizeSub[t][u] += sizeSub[t][v];
        if (sizeSub[t][v] > n/2) ok = false;
    }
    if (n - sizeSub[t][u] > n/2) ok = false;
    if (ok) centers[t].push_back(u);
}

// DFS para asignar IDs canónicos basados en multiconjuntos de hijos
void dfs_canonical(int t, int u, int p) {
    vector<int> childIds;
    for (int v : adj[t][u]) if (v != p) {
        dfs_canonical(t, v, u);
        childIds.push_back(canonId[t][v]);
    }
    sort(all(childIds));                   // ordenamos para multiconjunto
    if (!idmap[childIds])                  // si no existe el patrón
        idmap[childIds] = ++cidCounter;    // creamos uno nuevo
    canonId[t][u] = idmap[childIds];       // asignamos al nodo
}

// Resolver un caso: leer, hallar centroides y comparar isomorfismos
void solve_case() {
    cin >> n;
    reset();
    // lectura de los dos árboles
    for (int t = 0; t < 2; t++) {
        for (int i = 0, u, v; i < n-1; i++) {
            cin >> u >> v;
            adj[t][u].push_back(v);
            adj[t][v].push_back(u);
        }
        dfs_centroid(t, 1, -1);
    }
    // probamos cada par de centroides
    for (int c0 : centers[0]) {
        for (int c1 : centers[1]) {
            idmap.clear();
            dfs_canonical(0, c0, -1);
            dfs_canonical(1, c1, -1);
            if (canonId[0][c0] == canonId[1][c1]) {
                cout << "YES\n";
                return;
            }
        }
    }
    cout << "NO\n";
}

int main() {
    fastio;
    int T;
    cin >> T;
    while (T--) solve_case();
    return 0;
}
