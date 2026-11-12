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
 * Algoritmo : DP de probabilidades (serie al primero en llegar a n victorias)
 * Problema  : Clásico "Campeonato"/World Series, sin problema equivalente en CSES
 * Entrada   : n p: victorias que necesita cada equipo y probabilidad p de que gane el equipo A un partido
 * Salida    : probabilidad de que A gane la serie (10 decimales)
 * Complejidad: tiempo O(n^2), memoria O(n^2)
 */

int main() {
    fastio;
    int n;
    double p;
    cin >> n >> p;
    double q = 1 - p;

    // P[i][j] = probabilidad de que A gane si le faltan i victorias y a B le faltan j
    vector<vector<double>> P(n + 1, vector<double>(n + 1, 0.0));
    for (int i = 1; i <= n; i++) P[0][i] = 1.0;  // A ya ganó
    for (int j = 1; j <= n; j++) P[j][0] = 0.0;  // B ya ganó
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= n; j++)
            P[i][j] = p * P[i - 1][j] + q * P[i][j - 1];

    precision(10);
    cout << P[n][n] << "\n";
    return 0;
}
