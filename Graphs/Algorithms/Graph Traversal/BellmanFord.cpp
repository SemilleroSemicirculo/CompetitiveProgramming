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
 * Algoritmo : Bellman-Ford (detección de ciclo negativo)
 * Problema  : CSES 1197 - Cycle Finding (https://cses.fi/problemset/task/1197)
 * Entrada   : n m, luego m aristas dirigidas "a b c" (peso c)
 * Salida    : NO, o YES y un ciclo de peso negativo
 * Complejidad: tiempo O(n·m), memoria O(n + m)
 */

int main() {
    fastio;
    int n, m;
    cin >> n >> m;
    vector<array<ll, 3>> edges(m);
    for (auto &e : edges) cin >> e[0] >> e[1] >> e[2];

    // dist = 0 para todos: equivale a un nodo fuente virtual conectado a todos
    vector<ll> dist(n + 1, 0);
    vector<int> parent(n + 1, 0);
    int last = -1;
    for (int i = 0; i < n; i++) {
        last = -1;
        for (auto &[a, b, c] : edges) {
            if (dist[a] + c < dist[b]) {
                dist[b] = dist[a] + c;
                parent[b] = a;
                last = b;
            }
        }
        if (last == -1) break;
    }

    if (last == -1) {
        cout << "NO\n";
        return 0;
    }
    // retroceder n veces para asegurar estar dentro del ciclo
    for (int i = 0; i < n; i++) last = parent[last];
    vector<int> cycle;
    for (int v = last;; v = parent[v]) {
        cycle.push_back(v);
        if (v == last && cycle.size() > 1) break;
    }
    reverse(all(cycle));
    cout << "YES\n";
    for (int v : cycle) cout << v << ' ';
    cout << "\n";
    return 0;
}
