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
 * Algoritmo : Floyd-Warshall (distancias entre todos los pares)
 * Problema  : CSES 1672 - Shortest Routes II (https://cses.fi/problemset/task/1672)
 * Entrada   : n m q, luego m aristas no dirigidas "a b c" y q consultas "a b"
 * Salida    : la distancia mínima de cada consulta, o -1 si no hay camino
 * Complejidad: tiempo O(n^3 + q), memoria O(n^2)
 */

int main() {
    fastio;
    int n, m, q;
    cin >> n >> m >> q;
    // inf = INF / 4 para que dist[i][k] + dist[k][j] no desborde
    const ll inf = INF / 4;  // evita overflow al sumar
    vector<vector<ll>> dist(n + 1, vector<ll>(n + 1, inf));
    for (int i = 1; i <= n; i++) dist[i][i] = 0;
    for (int i = 0; i < m; i++) {
        int a, b;
        ll c;
        cin >> a >> b >> c;
        dist[a][b] = min(dist[a][b], c);
        dist[b][a] = min(dist[b][a], c);
    }

    // k = nodo intermedio permitido: se prueba pasar por k para cada par (i, j)
    for (int k = 1; k <= n; k++)
        for (int i = 1; i <= n; i++)
            for (int j = 1; j <= n; j++)
                if (dist[i][k] + dist[k][j] < dist[i][j])
                    dist[i][j] = dist[i][k] + dist[k][j];

    while (q--) {
        int a, b;
        cin >> a >> b;
        cout << (dist[a][b] >= inf ? -1 : dist[a][b]) << "\n";
    }
    return 0;
}
