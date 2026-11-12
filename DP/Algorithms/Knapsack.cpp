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
 * Algoritmo : Mochila 0/1 (DP unidimensional)
 * Problema  : CSES 1158 - Book Shop (https://cses.fi/problemset/task/1158)
 * Entrada   : n x, luego n precios y luego n cantidades de páginas
 * Salida    : máximo de páginas que se pueden comprar con presupuesto x
 * Complejidad: tiempo O(n·x), memoria O(x)
 */

int main() {
    fastio;
    int n, x;
    cin >> n >> x;
    vector<int> price(n), pages(n);
    for (auto &p : price) cin >> p;
    for (auto &p : pages) cin >> p;

    // dp[w] = máximo de páginas con presupuesto w
    vector<ll> dp(x + 1, 0);
    for (int i = 0; i < n; i++) {
        for (int w = x; w >= price[i]; w--) {
            dp[w] = max(dp[w], dp[w - price[i]] + pages[i]);
        }
    }
    cout << dp[x] << "\n";
    return 0;
}
