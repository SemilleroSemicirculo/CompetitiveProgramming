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
 * Algoritmo : Logaritmo discreto con baby-step giant-step (también con módulo no primo)
 * Problema  : Library Checker - Discrete Logarithm (https://judge.yosupo.jp/problem/discrete_logarithm_mod)
 * Entrada   : T; luego T líneas "X Y M" (0 ≤ X, Y < M ≤ 10^9)
 * Salida    : el menor K ≥ 0 con X^K ≡ Y (mód M), o -1 si no existe
 * Complejidad: tiempo O(√M log M) por consulta, memoria O(√M)
 */

ll dlog(ll a, ll b, ll m) {
    if (m == 1) return 0;
    a %= m; b %= m;
    if (b == 1) return 0;
    // mientras a y m no sean coprimos, se divide la ecuación entre g = gcd(a, m):
    // a^K = b  ⟹  (a/g)·a^(K−1) ≡ b/g (mód m/g); add acumula los factores a/g
    ll k = 0, add = 1;
    for (ll g = __gcd(a, m); g > 1; g = __gcd(a, m)) {
        if (b == add) return k;
        if (b % g) return -1;
        b /= g; m /= g; k++;
        add = add * (a / g) % m;
    }
    if (add == b % m) return k;
    // ahora gcd(a, m) = 1: add · a^x ≡ b con x = i·n − j
    ll n = (ll)sqrtl((long double)m) + 1;
    unordered_map<ll, ll> baby;   // b · a^j → j (el mayor j, para que i·n − j sea mínimo)
    ll cur = b % m;
    for (ll j = 0; j < n; j++) { baby[cur] = j; cur = cur * a % m; }
    ll an = 1;
    for (ll j = 0; j < n; j++) an = an * a % m;
    cur = add;
    for (ll i = 1; i <= n; i++) {
        cur = cur * an % m;
        auto it = baby.find(cur);
        if (it != baby.end()) return k + i * n - it->second;
    }
    return -1;
}

int main() {
    fastio;
    int T;
    cin >> T;
    while (T--) {
        ll x, y, m;
        cin >> x >> y >> m;
        cout << dlog(x, y, m) << "\n";
    }
    return 0;
}
