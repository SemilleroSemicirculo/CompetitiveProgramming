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
 * Algoritmo : Esperanza del máximo con P(máx ≤ m) = (m/k)^n
 * Problema  : CSES 1727 - Candy Lottery (https://cses.fi/problemset/task/1727)
 * Entrada   : n k
 * Salida    : valor esperado del máximo de n enteros al azar en [1, k], con seis decimales
 * Complejidad: tiempo O(k log n), memoria O(1)
 */

int main() {
    fastio;
    int n, k;
    cin >> n >> k;
    // el máximo es ≤ m si TODOS son ≤ m: (m/k)^n; entonces P(máx = m) = (m/k)^n − ((m−1)/k)^n
    double res = 0;
    for (int m = 1; m <= k; m++) res += m * (pow((double)m / k, n) - pow((double)(m - 1) / k, n));
    precision(6);
    cout << res << "\n";
    return 0;
}
