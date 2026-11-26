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
 * Algoritmo : Convolución con módulo arbitrario: NTT con tres primos y teorema chino del resto
 * Problema  : Library Checker - Convolution (mod 1,000,000,007) (https://judge.yosupo.jp/problem/convolution_mod_1000000007)
 * Entrada   : N, M; a_0 … a_{N−1}; b_0 … b_{M−1} (valores menores que 10^9 + 7)
 * Salida    : c_k = Σ a_i · b_{k−i} mód 10^9 + 7, para k = 0 … N + M − 2
 * Complejidad: tiempo O((N + M) log(N + M)) (tres NTT por factor), memoria O(N + M)
 */

ll power(ll b, ll e, ll m) { ll r = 1; b %= m; for (; e; e >>= 1, b = b * b % m) if (e & 1) r = r * b % m; return r; }

// NTT módulo un primo p = c·2^k + 1 con raíz primitiva g
void ntt(vector<ll> &a, bool inv, ll p, ll g) {
    int n = a.size();
    for (int i = 1, j = 0; i < n; i++) {
        int bit = n >> 1;
        for (; j & bit; bit >>= 1) j ^= bit;
        j ^= bit;
        if (i < j) swap(a[i], a[j]);
    }
    for (int len = 2; len <= n; len <<= 1) {
        ll w = power(g, (p - 1) / len, p);
        if (inv) w = power(w, p - 2, p);
        for (int i = 0; i < n; i += len) {
            ll wj = 1;
            for (int j = 0; j < len / 2; j++, wj = wj * w % p) {
                ll u = a[i + j], v = a[i + j + len / 2] * wj % p;
                a[i + j] = u + v < p ? u + v : u + v - p;
                a[i + j + len / 2] = u - v >= 0 ? u - v : u - v + p;
            }
        }
    }
    if (inv) { ll ni = power(n, p - 2, p); for (ll &x : a) x = x * ni % p; }
}

vector<ll> conv(vector<ll> a, vector<ll> b, ll p, ll g, int n) {
    a.resize(n); b.resize(n);
    for (ll &x : a) x %= p;
    for (ll &x : b) x %= p;
    ntt(a, false, p, g); ntt(b, false, p, g);
    for (int i = 0; i < n; i++) a[i] = a[i] * b[i] % p;
    ntt(a, true, p, g);
    return a;
}

int main() {
    fastio;
    int N, M;
    cin >> N >> M;
    vector<ll> a(N), b(M);
    for (ll &x : a) cin >> x;
    for (ll &x : b) cin >> x;
    int n = 1;
    while (n < N + M - 1) n <<= 1;
    // el coeficiente real es < N · (10^9+7)² < 10^24: se calcula módulo tres primos NTT
    // (producto ≈ 2·10^26) y se reconstruye con el chino del resto
    const ll P1 = 998244353, P2 = 167772161, P3 = 469762049;
    vector<ll> r1 = conv(a, b, P1, 3, n), r2 = conv(a, b, P2, 3, n), r3 = conv(a, b, P3, 3, n);
    const ll Q = 1000000007;
    ll i1_2 = power(P1, P2 - 2, P2), i12_3 = power(P1 * P2 % P3, P3 - 2, P3);
    for (int k = 0; k < N + M - 1; k++) {
        // x ≡ r1 (P1); x = r1 + P1·t, t ≡ (r2 − r1)/P1 (P2); luego el tercer primo igual
        ll t = ((r2[k] - r1[k]) % P2 + P2) % P2 * i1_2 % P2;
        __int128 x12 = r1[k] + (__int128)P1 * t;               // x mód P1·P2
        ll u = (ll)((((r3[k] - x12) % P3) + P3) % P3) * i12_3 % P3;
        __int128 x = x12 + (__int128)P1 * P2 * u;               // x exacto (< P1·P2·P3)
        cout << (ll)(x % Q) << " \n"[k == N + M - 2];
    }
    return 0;
}
