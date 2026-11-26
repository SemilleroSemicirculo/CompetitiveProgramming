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
 * Algoritmo : Esperanza como fracción p/q módulo primo (inversos modulares)
 * Problema  : Codeforces 1265E - Beautiful Mirrors (https://codeforces.com/problemset/problem/1265/E)
 * Entrada   : n, luego p_1 … p_n (el espejo i dice "sí" con probabilidad p_i/100)
 * Salida    : días esperados hasta que los n espejos digan "sí" seguidos, como p · q^(−1) mód 998244353
 * Complejidad: tiempo O(n + log M), memoria O(1)
 */

ll power(ll b, ll e) { ll r = 1; b %= MOD; for (; e; e >>= 1, b = b * b % MOD) if (e & 1) r = r * b % MOD; return r; }

int main() {
    fastio;
    int n;
    cin >> n;
    // E = (1 + q1 + q1·q2 + … + q1⋯q_{n−1}) / (q1⋯qn), con q_i = p_i/100:
    // el día k-ésimo de un intento solo ocurre si los k−1 anteriores dijeron "sí", y cada intento
    // completo tiene éxito con probabilidad q1⋯qn
    ll inv100 = power(100, MOD - 2), num = 0, prod = 1;
    for (int i = 0; i < n; i++) {
        ll p;
        cin >> p;
        num = (num + prod) % MOD;                 // suma 1, q1, q1·q2, ...
        prod = prod * (p * inv100 % MOD) % MOD;   // q1⋯qi
    }
    // dividir módulo primo = multiplicar por el inverso (pequeño teorema de Fermat)
    cout << num * power(prod, MOD - 2) % MOD << "\n";
    return 0;
}
