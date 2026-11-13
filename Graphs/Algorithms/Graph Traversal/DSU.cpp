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
 * Algoritmo : DSU (Union-Find con compresión de caminos y unión por tamaño)
 * Problema  : CSES 1676 - Road Construction (https://cses.fi/problemset/task/1676)
 * Entrada   : n m, luego m aristas "a b"
 * Salida    : tras cada arista: cantidad de componentes y tamaño de la componente más grande
 * Complejidad: tiempo O(m α(n)), memoria O(n)
 */

// Union-Find: parent[x] es el padre en el bosque y size el tamaño de cada conjunto
struct DSU {
    vector<int> parent, size;

    DSU(int n) {
        parent.resize(n + 1);
        size.assign(n + 1, 1);
        iota(all(parent), 0);
    }

    // compresión de caminos
    int find(int x) {
        return parent[x] == x ? x : parent[x] = find(parent[x]);
    }

    // unión por tamaño: el conjunto pequeño se cuelga del grande
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
    DSU dsu(n);
    // comps = componentes actuales, biggest = tamaño de la mayor
    int comps = n, biggest = 1;
    for (int i = 0; i < m; i++) {
        int a, b;
        cin >> a >> b;
        if (dsu.unite(a, b)) {
            comps--;
            biggest = max(biggest, dsu.size[dsu.find(a)]);
        }
        cout << comps << ' ' << biggest << "\n";
    }
    return 0;
}
