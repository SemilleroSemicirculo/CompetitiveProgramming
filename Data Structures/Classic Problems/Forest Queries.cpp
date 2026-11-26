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
 * Algoritmo : Sumas de prefijos en 2D
 * Problema  : CSES 1652 - Forest Queries (https://cses.fi/problemset/task/1652)
 * Entrada   : n q, n filas con '.' (vacío) y '*' (árbol), luego q consultas "y1 x1 y2 x2"
 * Salida    : cantidad de árboles en cada rectángulo
 * Complejidad: tiempo O(n^2 + q), memoria O(n^2)
 */

int main() {
    fastio;
    int n, q;
    cin >> n >> q;
    // p[i][j] = árboles en el rectángulo (1,1)-(i,j)
    vector<vector<int>> p(n + 1, vector<int>(n + 1, 0));
    for (int i = 1; i <= n; i++) {
        string row;
        cin >> row;
        for (int j = 1; j <= n; j++)
            // inclusión-exclusión: arriba + izquierda - esquina repetida + la celda
            p[i][j] = p[i - 1][j] + p[i][j - 1] - p[i - 1][j - 1] + (row[j - 1] == '*');
    }
    while (q--) {
        int y1, x1, y2, x2;
        cin >> y1 >> x1 >> y2 >> x2;
        cout << p[y2][x2] - p[y1 - 1][x2] - p[y2][x1 - 1] + p[y1 - 1][x1 - 1] << "\n";
    }
    return 0;
}
