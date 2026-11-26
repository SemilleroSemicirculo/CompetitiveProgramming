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
 * Algoritmo : Transformada teórica de números (NTT) módulo 998244353 (basado en KACTL, CC0)
 * Problema  : Library Checker - Convolution (https://judge.yosupo.jp/problem/convolution_mod)
 * Entrada   : N, M; a_0 … a_{N−1}; b_0 … b_{M−1} (valores menores que 998244353)
 * Salida    : c_0 … c_{N+M−2} con c_k = Σ a_i · b_{k−i} mód 998244353
 * Complejidad: tiempo O((N + M) log(N + M)), memoria O(N + M)
 */

ll power(ll b, ll e) { ll r = 1; b %= MOD; for (; e; e >>= 1, b = b * b % MOD) if (e & 1) r = r * b % MOD; return r; }

// 998244353 = 119·2^23 + 1 tiene raíces de la unidad de orden 2^k (k ≤ 23); 3 es raíz primitiva
void ntt(vector<ll> &a, bool inv) {
    int n = a.size();
    for (int i = 1, j = 0; i < n; i++) {
        int bit = n >> 1;
        for (; j & bit; bit >>= 1) j ^= bit;
        j ^= bit;
        if (i < j) swap(a[i], a[j]);
    }
    for (int len = 2; len <= n; len <<= 1) {
        ll w = power(3, (MOD - 1) / len);   // raíz de orden len, igual que e^(2πi/len) en la FFT
        if (inv) w = power(w, MOD - 2);
        for (int i = 0; i < n; i += len) {
            ll wj = 1;
            for (int j = 0; j < len / 2; j++, wj = wj * w % MOD) {
                ll u = a[i + j], v = a[i + j + len / 2] * wj % MOD;
                a[i + j] = u + v < MOD ? u + v : u + v - MOD;
                a[i + j + len / 2] = u - v >= 0 ? u - v : u - v + MOD;
            }
        }
    }
    if (inv) {
        ll ni = power(n, MOD - 2);
        for (ll &x : a) x = x * ni % MOD;
    }
}

int main() {
    fastio;
    int N, M;
    cin >> N >> M;
    int n = 1;
    while (n < N + M - 1) n <<= 1;
    vector<ll> a(n, 0), b(n, 0);
    for (int i = 0; i < N; i++) cin >> a[i];
    for (int i = 0; i < M; i++) cin >> b[i];
    ntt(a, false); ntt(b, false);
    for (int i = 0; i < n; i++) a[i] = a[i] * b[i] % MOD;
    ntt(a, true);
    for (int i = 0; i < N + M - 1; i++) cout << a[i] << " \n"[i == N + M - 2];
    return 0;
}
