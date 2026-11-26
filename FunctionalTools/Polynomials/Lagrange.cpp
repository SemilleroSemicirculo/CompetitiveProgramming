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
 * Algoritmo : Interpolación de Lagrange en puntos consecutivos (evaluar un polinomio de grado k en O(k))
 * Problema  : Codeforces 622F - The Sum of the k-th Powers (https://codeforces.com/problemset/problem/622/F)
 * Entrada   : n k (1 ≤ n ≤ 10^9, 0 ≤ k ≤ 10^6)
 * Salida    : 1^k + 2^k + … + n^k módulo 10^9 + 7
 * Complejidad: tiempo O(k log P), memoria O(k)
 */

const ll P = 1000000007;
ll power(ll b, ll e) { ll r = 1; b %= P; for (; e; e >>= 1, b = b * b % P) if (e & 1) r = r * b % P; return r; }

int main() {
    fastio;
    ll n;
    int k;
    cin >> n >> k;
    // S(x) = Σ_{i ≤ x} i^k es un polinomio de grado k + 1: bastan sus valores en x = 0 … k + 1
    int d = k + 2;
    vector<ll> y(d, 0);
    for (int x = 1; x < d; x++) y[x] = (y[x - 1] + power(x, k)) % P;
    if (n < d) { cout << y[n] << "\n"; return 0; }
    // S(n) = Σ_i y_i · Π_{j ≠ i} (n − j)/(i − j); con puntos 0 … d−1 el producto se arma con
    // prefijos y sufijos de (n − j), y el denominador es i! · (d−1−i)! con signo
    vector<ll> pre(d + 1, 1), suf(d + 1, 1), fact(d, 1);
    for (int j = 0; j < d; j++) pre[j + 1] = pre[j] * ((n - j) % P) % P;
    for (int j = d - 1; j >= 0; j--) suf[j] = suf[j + 1] * ((n - j) % P) % P;
    for (int i = 1; i < d; i++) fact[i] = fact[i - 1] * i % P;
    ll res = 0;
    for (int i = 0; i < d; i++) {
        ll num = pre[i] * suf[i + 1] % P;
        ll den = fact[i] * fact[d - 1 - i] % P;
        ll t = y[i] * num % P * power(den, P - 2) % P;
        if ((d - 1 - i) % 2) t = (P - t) % P;   // signo de Π (i − j) para j > i
        res = (res + t) % P;
    }
    cout << res << "\n";
    return 0;
}
