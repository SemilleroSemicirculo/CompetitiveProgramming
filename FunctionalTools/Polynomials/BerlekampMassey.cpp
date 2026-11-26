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
 * Algoritmo : Berlekamp-Massey: la recurrencia lineal más corta de una secuencia (basado en KACTL, CC0)
 * Problema  : Library Checker - Find Linear Recurrence (https://judge.yosupo.jp/problem/find_linear_recurrence)
 * Entrada   : N; luego a_0 … a_{N−1} (valores menores que 998244353)
 * Salida    : d y luego c_1 … c_d con a_i = c_1·a_{i−1} + … + c_d·a_{i−d} (mód 998244353)
 * Complejidad: tiempo O(N²), memoria O(N)
 */

ll power(ll b, ll e) { ll r = 1; b %= MOD; for (; e; e >>= 1, b = b * b % MOD) if (e & 1) r = r * b % MOD; return r; }

int main() {
    fastio;
    int n;
    cin >> n;
    vector<ll> s(n);
    for (ll &x : s) cin >> x;
    // C = recurrencia actual (C[0] = 1); B = la última recurrencia antes de alargar C
    vector<ll> C(n + 1, 0), B(n + 1, 0), T;
    C[0] = B[0] = 1;
    int L = 0, m = 0;
    ll b = 1;   // discrepancia que tenía B
    for (int i = 0; i < n; i++) {
        m++;
        ll d = s[i] % MOD;   // discrepancia: cuánto falla C en la posición i
        for (int j = 1; j <= L; j++) d = (d + C[j] * s[i - j]) % MOD;
        if (!d) continue;
        T = C;
        ll coef = d * power(b, MOD - 2) % MOD;
        for (int j = m; j <= n; j++) C[j] = ((C[j] - coef * B[j - m]) % MOD + MOD) % MOD;   // corrige con B
        if (2 * L > i) continue;
        L = i + 1 - L; B = T; b = d; m = 0;   // la recurrencia tuvo que alargarse
    }
    cout << L << "\n";
    for (int j = 1; j <= L; j++) cout << (MOD - C[j]) % MOD << " \n"[j == L];
    if (L == 0) cout << "\n";
    return 0;
}
