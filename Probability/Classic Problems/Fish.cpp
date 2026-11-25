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
 * Algoritmo : DP de probabilidades sobre subconjuntos (bitmask)
 * Problema  : Codeforces 16E - Fish (https://codeforces.com/problemset/problem/16/E)
 * Entrada   : n, luego la matriz a (a[i][j] = probabilidad de que i se coma a j)
 * Salida    : para cada pez, la probabilidad de ser el último
 * Complejidad: tiempo O(2^n · n^2), memoria O(2^n)
 */

int main() {
    fastio;
    int n;
    cin >> n;
    vector<vector<double>> a(n, vector<double>(n));
    for (auto &row : a) for (auto &x : row) cin >> x;
    // P[mask] = probabilidad de que en algún momento queden vivos exactamente los peces de mask
    int full = (1 << n) - 1;
    vector<double> P(1 << n, 0.0);
    P[full] = 1.0;
    // de un conjunto se pasa a uno con un pez menos: se recorre de conjuntos grandes a pequeños
    for (int mask = full; mask > 0; mask--) {
        if (P[mask] == 0) continue;
        int k = __builtin_popcount(mask);
        if (k < 2) continue;
        double pares = k * (k - 1) / 2.0;  // cada par se encuentra con la misma probabilidad
        for (int i = 0; i < n; i++) if (mask >> i & 1)
            for (int j = 0; j < n; j++) if (j != i && (mask >> j & 1))
                // se encuentran i y j (1/pares) e i se come a j (a[i][j])
                P[mask ^ (1 << j)] += P[mask] / pares * a[i][j];
    }
    precision(9);
    for (int i = 0; i < n; i++) cout << P[1 << i] << ' ';
    cout << "\n";
    return 0;
}
