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
 * Algoritmo : DP sobre la distribución en el tiempo (proceso que avanza con probabilidad p)
 * Problema  : Codeforces 518D - Ilya and Escalator (https://codeforces.com/problemset/problem/518/D)
 * Entrada   : n p t
 * Salida    : número esperado de personas en la escalera tras t segundos (error ≤ 10^-6)
 * Complejidad: tiempo O(n · t), memoria O(n)
 */

int main() {
    fastio;
    int n, t;
    double p;
    cin >> n >> p >> t;
    // d[i] = probabilidad de que haya i personas en la escalera en el segundo actual
    vector<double> d(n + 1, 0.0);
    d[0] = 1.0;
    for (int s = 0; s < t; s++) {
        vector<double> e(n + 1, 0.0);
        for (int i = 0; i < n; i++) {
            e[i + 1] += d[i] * p;      // el primero de la fila entra
            e[i] += d[i] * (1 - p);    // se queda quieto
        }
        e[n] += d[n];                  // ya entraron todos
        d = e;
    }
    double res = 0;
    for (int i = 0; i <= n; i++) res += i * d[i];
    precision(9);
    cout << res << "\n";
    return 0;
}
