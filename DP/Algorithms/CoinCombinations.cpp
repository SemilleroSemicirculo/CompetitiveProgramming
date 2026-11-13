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
 * Algoritmo : Conteo de formas con monedas (combinaciones y permutaciones)
 * Problema  : CSES 1636 - Coin Combinations II (https://cses.fi/problemset/task/1636)
 * Entrada   : n x, luego n valores de monedas
 * Salida    : cantidad de combinaciones (sin importar el orden) que suman x, módulo 10^9+7
 * Complejidad: tiempo O(n·x), memoria O(x)
 */

const int MODC = 1000000007;  // este problema pide módulo 10^9+7

int main() {
    fastio;
    int n, x;
    cin >> n >> x;
    vector<int> coin(n);
    for (auto &c : coin) cin >> c;

    // combinaciones: la moneda va en el bucle externo (el orden no importa)
    // dp[s] = formas de sumar s
    vector<int> dp(x + 1, 0);
    // hay una forma de sumar 0: no usar monedas
    dp[0] = 1;
    for (int c : coin)
        for (int s = c; s <= x; s++)
            dp[s] = (dp[s] + dp[s - c]) % MODC;
    // Para contar permutaciones (Coin Combinations I, CSES 1635) se invierten los bucles:
    // for s in 1..x: for c in coin: dp[s] += dp[s - c]
    cout << dp[x] << "\n";
    return 0;
}
