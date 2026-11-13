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
 * Algoritmo : Descomposición por centroides (caminos de longitud fija)
 * Problema  : CSES 2080 - Fixed-Length Paths I (https://cses.fi/problemset/task/2080)
 * Entrada   : n k, luego n-1 aristas "a b"
 * Salida    : cantidad de caminos con exactamente k aristas
 * Complejidad: tiempo O(n log n), memoria O(n)
 */

int n, k;
vector<vector<int>> G;
vector<int> sz, cnt;
vector<bool> removed;
ll answer = 0;
int maxDepth;

// tamaño de cada subárbol (ignorando centroides ya removidos)
int calcSize(int u, int p) {
    sz[u] = 1;
    for (int v : G[u])
        if (v != p && !removed[v]) sz[u] += calcSize(v, u);
    return sz[u];
}

// baja hacia el hijo con más de la mitad de los nodos
int findCentroid(int u, int p, int total) {
    for (int v : G[u])
        if (v != p && !removed[v] && sz[v] * 2 > total) return findCentroid(v, u, total);
    return u;
}

// cuenta caminos que pasan por el centroide usando cnt[d] = nodos a profundidad d ya vistos
// recorre un subárbol: con fill se registra la profundidad, sin fill se cuentan caminos de longitud k
void collect(int u, int p, int depth, bool fill) {
    if (depth > k) return;
    if (fill) cnt[depth]++;
    else answer += cnt[k - depth];
    maxDepth = max(maxDepth, depth);
    for (int v : G[u])
        if (v != p && !removed[v]) collect(v, u, depth + 1, fill);
}

// 1) se halla el centroide, 2) se cuentan los caminos que pasan por él, 3) se repite en cada parte
void decompose(int root) {
    int total = calcSize(root, 0);
    int c = findCentroid(root, 0, total);
    removed[c] = true;

    cnt[0] = 1;
    int used = 0;
    for (int v : G[c]) {
        if (removed[v]) continue;
        maxDepth = 0;
        // primero se consulta contra los subárboles anteriores
        collect(v, c, 1, false);  // primero se consulta contra los subárboles anteriores
        collect(v, c, 1, true);   // luego se agrega este subárbol
        used = max(used, maxDepth);
    }
    // se limpia cnt para el siguiente centroide
    for (int d = 0; d <= min(used, k); d++) cnt[d] = 0;

    for (int v : G[c])
        if (!removed[v]) decompose(v);
}

int main() {
    fastio;
    cin >> n >> k;
    G.assign(n + 1, {});
    sz.assign(n + 1, 0);
    cnt.assign(n + 2, 0);
    removed.assign(n + 1, false);
    for (int i = 0; i < n - 1; i++) {
        int a, b;
        cin >> a >> b;
        G[a].push_back(b);
        G[b].push_back(a);
    }
    decompose(1);
    cout << answer << "\n";
    return 0;
}
