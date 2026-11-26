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
 * Algoritmo : Algoritmo húngaro (asignación de costo mínimo con potenciales)
 * Problema  : CSES 2129 - Task Assignment (https://cses.fi/problemset/task/2129)
 * Entrada   : n; luego la matriz n × n con el costo c[i][j] de que el empleado i haga la tarea j
 * Salida    : el costo mínimo total y luego n parejas "empleado tarea"
 * Complejidad: tiempo O(n³), memoria O(n²)
 */

int main() {
    fastio;
    int n;
    cin >> n;
    vector<vector<ll>> c(n + 1, vector<ll>(n + 1));
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= n; j++) cin >> c[i][j];
    // u, v son potenciales (variables duales): u[i] + v[j] ≤ c[i][j] siempre, y las aristas
    // "ajustadas" (igualdad) son las únicas que se usan. p[j] = fila asignada a la columna j.
    const ll BIG = LLONG_MAX / 4;
    vector<ll> u(n + 1, 0), v(n + 1, 0);
    vector<int> p(n + 1, 0), way(n + 1, 0);
    for (int i = 1; i <= n; i++) {
        // se agrega la fila i buscando un camino aumentante tipo Dijkstra sobre costos reducidos
        p[0] = i;
        int j0 = 0;
        vector<ll> minv(n + 1, BIG);
        vector<bool> used(n + 1, false);
        do {
            used[j0] = true;
            int i0 = p[j0], j1 = 0;
            ll delta = BIG;
            for (int j = 1; j <= n; j++)
                if (!used[j]) {
                    ll cur = c[i0][j] - u[i0] - v[j];          // costo reducido
                    if (cur < minv[j]) minv[j] = cur, way[j] = j0;
                    if (minv[j] < delta) delta = minv[j], j1 = j;
                }
            // mover los potenciales lo justo para que aparezca una arista ajustada nueva
            for (int j = 0; j <= n; j++)
                if (used[j]) u[p[j]] += delta, v[j] -= delta;
                else minv[j] -= delta;
            j0 = j1;
        } while (p[j0] != 0);                                  // hasta llegar a una columna libre
        do { int j1 = way[j0]; p[j0] = p[j1]; j0 = j1; } while (j0);   // aumentar por el camino
    }
    vector<int> tarea(n + 1);
    ll total = 0;
    for (int j = 1; j <= n; j++) tarea[p[j]] = j, total += c[p[j]][j];
    cout << total << "\n";
    for (int i = 1; i <= n; i++) cout << i << " " << tarea[i] << "\n";
    return 0;
}
