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
 * Algoritmo : Determinante módulo un primo con eliminación de Gauss
 * Problema  : Library Checker - Determinant of Matrix (https://judge.yosupo.jp/problem/matrix_det)
 * Entrada   : N; luego la matriz N × N con valores en [0, 998244353)
 * Salida    : el determinante módulo 998244353
 * Complejidad: tiempo O(N³), memoria O(N²)
 */

ll power(ll b, ll e) { ll r = 1; b %= MOD; for (; e; e >>= 1, b = b * b % MOD) if (e & 1) r = r * b % MOD; return r; }

int main() {
    fastio;
    int n;
    cin >> n;
    vector<vector<ll>> a(n, vector<ll>(n));
    for (auto &row : a) for (ll &x : row) cin >> x;
    ll det = 1;
    for (int c = 0; c < n; c++) {
        int piv = c;
        while (piv < n && !a[piv][c]) piv++;
        if (piv == n) { cout << 0 << "\n"; return 0; }   // columna sin pivote: det = 0
        if (piv != c) { swap(a[piv], a[c]); det = (MOD - det) % MOD; }   // cambiar filas cambia el signo
        det = det * a[c][c] % MOD;                       // el det es el producto de los pivotes
        ll inv = power(a[c][c], MOD - 2);
        for (int i = c + 1; i < n; i++) {
            ll f = a[i][c] * inv % MOD;
            if (!f) continue;
            for (int j = c; j < n; j++) a[i][j] = ((a[i][j] - f * a[c][j]) % MOD + MOD) % MOD;   // no cambia el det
        }
    }
    cout << det << "\n";
    return 0;
}
