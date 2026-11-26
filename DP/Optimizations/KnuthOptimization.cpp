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
 * Algoritmo : Optimización de Knuth para DP de intervalos (opt[i][j−1] ≤ opt[i][j] ≤ opt[i+1][j])
 * Problema  : CSES 2088 - Knuth Division (https://cses.fi/problemset/task/2088)
 * Entrada   : n; el arreglo x_1 … x_n
 * Salida    : el costo mínimo de partir el arreglo en n piezas, si partir un tramo cuesta su suma
 * Complejidad: tiempo O(n²), memoria O(n²)
 */

int main() {
    fastio;
    int n;
    cin >> n;
    vector<ll> pre(n + 1, 0);
    for (int i = 1; i <= n; i++) { ll x; cin >> x; pre[i] = pre[i - 1] + x; }
    // dp[i][j] = costo de dejar en piezas sueltas el tramo [i, j]; opt[i][j] = mejor corte
    vector<vector<ll>> dp(n + 2, vector<ll>(n + 2, 0));
    vector<vector<int>> opt(n + 2, vector<int>(n + 2, 0));
    for (int i = 1; i <= n; i++) opt[i][i] = i;
    for (int len = 2; len <= n; len++)
        for (int i = 1; i + len - 1 <= n; i++) {
            int j = i + len - 1;
            dp[i][j] = LLONG_MAX;
            // solo se prueban los cortes entre opt[i][j−1] y opt[i+1][j]: en total O(n) por largo
            for (int c = opt[i][j - 1]; c <= min(j - 1, opt[i + 1][j]); c++) {
                ll v = dp[i][c] + dp[c + 1][j];
                if (v < dp[i][j]) dp[i][j] = v, opt[i][j] = c;
            }
            dp[i][j] += pre[j] - pre[i - 1];   // partir [i, j] cuesta su suma
        }
    cout << dp[1][n] << "\n";
    return 0;
}
