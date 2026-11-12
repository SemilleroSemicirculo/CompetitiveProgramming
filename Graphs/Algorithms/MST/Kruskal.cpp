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
 * Algoritmo : Kruskal (árbol de expansión mínima con DSU)
 * Problema  : CSES 1675 - Road Reparation (https://cses.fi/problemset/task/1675)
 * Entrada   : n m, luego m aristas "a b c" (costo c)
 * Salida    : el costo mínimo para conectar todo, o IMPOSSIBLE
 * Complejidad: tiempo O(m log m), memoria O(n + m)
 */

struct DSU {
    vector<int> parent, size;

    DSU(int n) {
        parent.resize(n + 1);
        size.assign(n + 1, 1);
        iota(all(parent), 0);
    }

    int find(int x) {
        return parent[x] == x ? x : parent[x] = find(parent[x]);
    }

    bool unite(int a, int b) {
        a = find(a), b = find(b);
        if (a == b) return false;
        if (size[a] < size[b]) swap(a, b);
        parent[b] = a;
        size[a] += size[b];
        return true;
    }
};

int main() {
    fastio;
    int n, m;
    cin >> n >> m;
    vector<array<ll, 3>> edges(m);  // {peso, a, b}
    for (auto &e : edges) cin >> e[1] >> e[2] >> e[0];
    sort(all(edges));

    DSU dsu(n);
    ll total = 0;
    int used = 0;
    for (auto &[w, a, b] : edges) {
        if (dsu.unite(a, b)) {
            total += w;
            used++;
        }
    }

    if (used != n - 1) cout << "IMPOSSIBLE\n";
    else cout << total << "\n";
    return 0;
}
