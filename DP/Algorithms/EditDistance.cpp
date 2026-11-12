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
 * Algoritmo : Distancia de edición (Levenshtein)
 * Problema  : CSES 1639 - Edit Distance (https://cses.fi/problemset/task/1639)
 * Entrada   : dos cadenas a y b
 * Salida    : mínimo de operaciones (insertar, borrar, reemplazar) para convertir a en b
 * Complejidad: tiempo O(n·m), memoria O(n·m)
 */

int main() {
    fastio;
    string a, b;
    cin >> a >> b;
    int n = a.size(), m = b.size();

    // dp[i][j] = distancia entre a[0..i) y b[0..j)
    vector<vector<int>> dp(n + 1, vector<int>(m + 1, 0));
    for (int i = 0; i <= n; i++) dp[i][0] = i;
    for (int j = 0; j <= m; j++) dp[0][j] = j;
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= m; j++)
            dp[i][j] = min({dp[i - 1][j] + 1, dp[i][j - 1] + 1,
                            dp[i - 1][j - 1] + (a[i - 1] != b[j - 1])});
    cout << dp[n][m] << "\n";
    return 0;
}
