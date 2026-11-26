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
 * Algoritmo : DP en cuadrícula (caminos con obstáculos)
 * Problema  : CSES 1638 - Grid Paths I (https://cses.fi/problemset/task/1638)
 * Entrada   : n, luego n filas de n caracteres ('.' libre, '*' trampa)
 * Salida    : caminos de la esquina superior izquierda a la inferior derecha (solo derecha/abajo), módulo 10^9+7
 * Complejidad: tiempo O(n^2), memoria O(n^2)
 */

const ll M = 1e9 + 7;

int main() {
    fastio;
    int n;
    cin >> n;
    vector<string> g(n);
    for (auto &row : g) cin >> row;
    // dp[i][j] = caminos que llegan a (i, j)
    vector<vector<ll>> dp(n, vector<ll>(n, 0));
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++) {
            if (g[i][j] == '*') continue;           // a una trampa no se llega
            if (i == 0 && j == 0) { dp[i][j] = 1; continue; }
            if (i > 0) dp[i][j] += dp[i - 1][j];    // llega desde arriba
            if (j > 0) dp[i][j] += dp[i][j - 1];    // llega desde la izquierda
            dp[i][j] %= M;
        }
    cout << dp[n - 1][n - 1] << "\n";
    return 0;
}
