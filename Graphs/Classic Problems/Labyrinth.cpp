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
 * Algoritmo : BFS en cuadrícula con reconstrucción del camino
 * Problema  : CSES 1193 - Labyrinth (https://cses.fi/problemset/task/1193)
 * Entrada   : n m, luego n filas con '.', '#', 'A' (inicio) y 'B' (fin)
 * Salida    : YES, el largo y las direcciones (L, R, U, D) de un camino más corto; o NO
 * Complejidad: tiempo O(n · m), memoria O(n · m)
 */

int main() {
    fastio;
    int n, m;
    cin >> n >> m;
    vector<string> g(n);
    for (auto &row : g) cin >> row;
    int dx[] = {0, 0, -1, 1}, dy[] = {-1, 1, 0, 0};
    const char *name = "LRUD";
    // from[i][j] = dirección con la que se llegó a (i, j), -1 si no se ha visitado
    vector<vector<int>> from(n, vector<int>(m, -1));
    queue<pair<int, int>> q;
    int ex = 0, ey = 0;
    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++) {
            if (g[i][j] == 'A') { q.push({i, j}); from[i][j] = 4; }
            if (g[i][j] == 'B') ex = i, ey = j;
        }
    // BFS: la primera vez que se llega a una celda es por un camino más corto
    while (!q.empty()) {
        auto [x, y] = q.front();
        q.pop();
        for (int d = 0; d < 4; d++) {
            int a = x + dx[d], b = y + dy[d];
            if (a < 0 || b < 0 || a >= n || b >= m || g[a][b] == '#' || from[a][b] != -1) continue;
            from[a][b] = d;
            q.push({a, b});
        }
    }
    if (from[ex][ey] == -1) { cout << "NO\n"; return 0; }
    // se reconstruye desde B hacia A siguiendo las direcciones al revés
    string path;
    for (int x = ex, y = ey; from[x][y] != 4;) {
        int d = from[x][y];
        path += name[d];
        x -= dx[d], y -= dy[d];
    }
    reverse(all(path));
    cout << "YES\n" << path.size() << "\n" << path << "\n";
    return 0;
}
