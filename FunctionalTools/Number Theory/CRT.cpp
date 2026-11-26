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
 * Algoritmo : Teorema chino del resto general (módulos no necesariamente coprimos)
 * Problema  : Kattis - generalchineseremainder (https://open.kattis.com/problems/generalchineseremainder)
 * Entrada   : T casos; cada uno "a n b m" con 0 ≤ a < n, 0 ≤ b < m, n, m ≤ 10^9
 * Salida    : "x K" con K = mcm(n, m) y 0 ≤ x < K tal que x ≡ a (mód n) y x ≡ b (mód m), o "no solution"
 * Complejidad: tiempo O(log) por caso, memoria O(1)
 */

ll ext_gcd(ll a, ll b, ll &x, ll &y) {
    if (b == 0) { x = 1; y = 0; return a; }
    ll x1, y1, g = ext_gcd(b, a % b, x1, y1);
    x = y1; y = x1 - (a / b) * y1;
    return g;
}

// combina x ≡ a (mód n) y x ≡ b (mód m); devuelve {x, mcm} o {-1, -1} si no hay solución
pair<ll, ll> crt(ll a, ll n, ll b, ll m) {
    ll p, q;
    ll g = ext_gcd(n, m, p, q);              // n·p + m·q = g
    if ((b - a) % g != 0) return {-1, -1};   // las dos congruencias se contradicen
    ll l = n / g * m;                        // mcm(n, m), hasta 10^18
    // x = a + n·t con n·t ≡ b − a (mód m)  →  t ≡ (b − a)/g · p (mód m/g)
    __int128 t = (__int128)((b - a) / g) * p % (m / g);
    __int128 x = (a + (__int128)n * t) % l;
    if (x < 0) x += l;
    return {(ll)x, l};
}

int main() {
    fastio;
    int T;
    cin >> T;
    while (T--) {
        ll a, n, b, m;
        cin >> a >> n >> b >> m;
        auto [x, K] = crt(a, n, b, m);
        if (K == -1) cout << "no solution\n";
        else cout << x << " " << K << "\n";
    }
    return 0;
}
