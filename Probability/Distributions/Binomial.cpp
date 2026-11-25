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
 * Algoritmo : Distribución binomial (n ensayos de Bernoulli independientes con probabilidad p)
 * Problema  : Sin problema equivalente en CSES; formato propio
 * Entrada   : n k p (n ≤ 1000, 0 ≤ k ≤ n, 0 ≤ p ≤ 1)
 * Salida    : P(X = k), P(X ≥ k), E[X] = np y Var(X) = np(1 − p), uno por línea con nueve decimales
 * Complejidad: tiempo O(n^2), memoria O(n)
 */

int main() {
    fastio;
    int n, k;
    double p;
    cin >> n >> k >> p;
    // d[i] = P(i éxitos en los ensayos hechos hasta ahora). Cada ensayo: éxito con p, fracaso con 1 − p.
    // Así se arma la binomial sin calcular C(n, k) ni potencias (y sin desbordar con n grande).
    vector<double> d(n + 1, 0.0);
    d[0] = 1.0;
    for (int t = 1; t <= n; t++)
        for (int i = t; i >= 0; i--)
            d[i] = d[i] * (1 - p) + (i ? d[i - 1] * p : 0.0);
    // forma cerrada equivalente: P(X = k) = C(n, k) · p^k · (1 − p)^(n − k)
    double cola = 0;
    for (int i = k; i <= n; i++) cola += d[i];
    precision(9);
    cout << d[k] << "\n" << cola << "\n" << n * p << "\n" << n * p * (1 - p) << "\n";
    return 0;
}
