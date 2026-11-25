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
 * Algoritmo : DP de probabilidades (distribución de la suma de varios dados)
 * Problema  : CSES 1725 - Dice Probability (https://cses.fi/problemset/task/1725)
 * Entrada   : n a b
 * Salida    : probabilidad de que la suma de n dados esté en [a, b], con seis decimales
 * Complejidad: tiempo O(n · 6n · 6), memoria O(6n)
 */

int main() {
    fastio;
    int n, a, b;
    cin >> n >> a >> b;
    // p[s] = probabilidad de que la suma de los dados lanzados hasta ahora sea s
    vector<double> p(6 * n + 1, 0.0);
    p[0] = 1.0;
    for (int d = 1; d <= n; d++) {
        vector<double> q(6 * n + 1, 0.0);
        // cada cara 1..6 sale con probabilidad 1/6 y suma su valor
        for (int s = 0; s <= 6 * (d - 1); s++)
            if (p[s] > 0)
                for (int c = 1; c <= 6; c++) q[s + c] += p[s] / 6.0;
        p = q;
    }
    double res = 0;
    for (int s = a; s <= b; s++) res += p[s];
    precision(6);
    cout << res << "\n";
    return 0;
}
