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
 * Algoritmo : Teorema de Lucas: C(n, k) módulo un primo pequeño p con n, k hasta 10^18
 * Problema  : Problema propio: T consultas de coeficientes binomiales módulo un primo
 * Entrada   : T; luego T líneas "n k p" (0 ≤ k ≤ n ≤ 10^18, p primo, p ≤ 10^5)
 * Salida    : C(n, k) mód p para cada consulta
 * Complejidad: tiempo O(p + log_p n) por consulta, memoria O(p)
 */

ll power(ll b, ll e, ll m) { ll r = 1 % m; b %= m; for (; e; e >>= 1, b = b * b % m) if (e & 1) r = r * b % m; return r; }

int main() {
    fastio;
    int T;
    cin >> T;
    while (T--) {
        ll n, k, p;
        cin >> n >> k >> p;
        // factoriales hasta p − 1 para C(a, b) con a, b < p
        vector<ll> f(p, 1);
        for (ll i = 1; i < p; i++) f[i] = f[i - 1] * i % p;
        auto C = [&](ll a, ll b) -> ll {
            if (b > a) return 0;
            return f[a] * power(f[b] * f[a - b] % p, p - 2, p) % p;
        };
        // Lucas: C(n, k) ≡ Π C(n_i, k_i) con n_i, k_i los dígitos de n y k en base p
        ll res = 1;
        while ((n || k) && res) {
            res = res * C(n % p, k % p) % p;
            n /= p; k /= p;
        }
        cout << res << "\n";
    }
    return 0;
}
