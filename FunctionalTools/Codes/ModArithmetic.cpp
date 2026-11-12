#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef long double ld;
const ll INF = numeric_limits<ll>::max();

#define all(x) x.begin(), x.end()
#define rall(x) x.rbegin(), x.rend()
#define MOD 1000000007
#define pi acos(-1)
#define gcd __gcd
#define lcm(a, b) ((a) * (b) / gcd(a, b))
#define precision(n) cout << fixed << setprecision(n)
#define debug(arr) cerr << #arr << " = "; for (auto &x : arr) cerr << x << " "; cerr << endl;
#define fastio ios::sync_with_stdio(0); cin.tie(0); cout.tie(0);

/*
 * Algoritmo : Exponenciación binaria, inverso modular y nCr
 * Problema  : CSES 1079 - Binomial Coefficients (https://cses.fi/problemset/task/1079)
 * Entrada   : t, luego t pares "a b"
 * Salida    : C(a, b) módulo 10^9 + 7
 * Complejidad: tiempo O(10^6 + t), memoria O(10^6)
 */

const int MAXN = 1000001;
vector<ll> fact(MAXN), inv_fact(MAXN);

// a^b mod MOD en O(log b)
ll binpow(ll a, ll b) {
    ll res = 1;
    a %= MOD;
    while (b > 0) {
        if (b & 1) res = res * a % MOD;
        a = a * a % MOD;
        b >>= 1;
    }
    return res;
}

// inverso modular (MOD debe ser primo): a^(MOD-2)
ll mod_inv(ll a) {
    return binpow(a, MOD - 2);
}

void precompute() {
    fact[0] = 1;
    for (int i = 1; i < MAXN; i++) fact[i] = fact[i - 1] * i % MOD;
    inv_fact[MAXN - 1] = mod_inv(fact[MAXN - 1]);
    for (int i = MAXN - 1; i > 0; i--) inv_fact[i - 1] = inv_fact[i] * i % MOD;
}

// C(n, k) mod MOD
ll nCr(int n, int k) {
    if (k < 0 || k > n) return 0;
    return fact[n] * inv_fact[k] % MOD * inv_fact[n - k] % MOD;
}

int main() {
    fastio;
    precompute();
    int t; cin >> t;
    while (t--) {
        int a, b; cin >> a >> b;
        cout << nCr(a, b) << "\n";
    }
    return 0;
}
