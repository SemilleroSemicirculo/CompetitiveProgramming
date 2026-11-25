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
 * Algoritmo : Componentes conexas en una cuadrícula (flood fill con BFS)
 * Problema  : CSES 1192 - Counting Rooms (https://cses.fi/problemset/task/1192)
 * Entrada   : n m, luego n filas de m caracteres ('.' piso, '#' pared)
 * Salida    : cantidad de cuartos (regiones de piso conectadas)
 * Complejidad: tiempo O(n · m), memoria O(n · m)
 */

int main() {
    fastio;
    int n, m;
    cin >> n >> m;
    vector<string> g(n);
    for (auto &row : g) cin >> row;
    int dx[] = {1, -1, 0, 0}, dy[] = {0, 0, 1, -1};
    int rooms = 0;
    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++) {
            if (g[i][j] != '.') continue;
            // piso sin visitar: es un cuarto nuevo; se pinta entero con BFS
            rooms++;
            queue<pair<int, int>> q;
            q.push({i, j});
            g[i][j] = '#';  // marcar como visitado
            while (!q.empty()) {
                auto [x, y] = q.front();
                q.pop();
                for (int d = 0; d < 4; d++) {
                    int a = x + dx[d], b = y + dy[d];
                    if (a < 0 || b < 0 || a >= n || b >= m || g[a][b] != '.') continue;
                    g[a][b] = '#';
                    q.push({a, b});
                }
            }
        }
    cout << rooms << "\n";
    return 0;
}
