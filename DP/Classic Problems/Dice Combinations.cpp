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
 * Algoritmo : DP de conteo (formas de formar una suma)
 * Problema  : CSES 1633 - Dice Combinations (https://cses.fi/problemset/task/1633)
 * Entrada   : un entero n
 * Salida    : número de formas de sumar n lanzando un dado una o más veces, módulo 10^9+7
 * Complejidad: tiempo O(6n), memoria O(n)
 */

const ll M = 1e9 + 7;

int main() {
    fastio;
    int n;
    cin >> n;
    // dp[s] = formas de llegar exactamente a la suma s
    vector<ll> dp(n + 1, 0);
    dp[0] = 1;  // la suma 0 se forma de una sola forma: sin lanzar
    for (int s = 1; s <= n; s++)
        // el último lanzamiento fue una cara k entre 1 y 6
        for (int k = 1; k <= 6 && k <= s; k++)
            dp[s] = (dp[s] + dp[s - k]) % M;
    cout << dp[n] << "\n";
    return 0;
}
