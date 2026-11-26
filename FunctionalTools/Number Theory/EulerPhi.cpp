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
 * Algoritmo : Función φ de Euler para todos los números hasta N (criba)
 * Problema  : SPOJ ETF - Euler Totient Function (https://www.spoj.com/problems/ETF/)
 * Entrada   : T, luego T números n (1 ≤ n ≤ 10^6)
 * Salida    : φ(n) para cada uno: cuántos k en [1, n] cumplen gcd(k, n) = 1
 * Complejidad: tiempo O(N log log N + T), memoria O(N)
 */

const int N = 1000000;

int main() {
    fastio;
    // φ(n) = n · Π (1 − 1/p) sobre los primos p que dividen a n
    vector<int> phi(N + 1);
    iota(all(phi), 0);
    for (int p = 2; p <= N; p++)
        if (phi[p] == p)                  // nadie lo tocó: p es primo
            for (int j = p; j <= N; j += p)
                phi[j] -= phi[j] / p;     // multiplicar por (1 − 1/p) sin fracciones
    int T;
    cin >> T;
    while (T--) {
        int n;
        cin >> n;
        cout << phi[n] << "\n";
    }
    return 0;
}
