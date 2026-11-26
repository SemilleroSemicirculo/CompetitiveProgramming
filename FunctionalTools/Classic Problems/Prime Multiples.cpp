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
 * Algoritmo : Principio de inclusión-exclusión sobre subconjuntos
 * Problema  : CSES 2185 - Prime Multiples (https://cses.fi/problemset/task/2185)
 * Entrada   : n k, luego k primos distintos
 * Salida    : cuántos enteros de 1 a n son divisibles por al menos uno de los primos
 * Complejidad: tiempo O(2^k · k), memoria O(k)
 */

int main() {
    fastio;
    ll n;
    int k;
    cin >> n >> k;
    vector<ll> a(k);
    for (auto &p : a) cin >> p;
    ll total = 0;
    // |A1 ∪ ... ∪ Ak| = Σ (−1)^(|S|+1) · ⌊n / producto(S)⌋ sobre los subconjuntos S no vacíos
    for (int mask = 1; mask < (1 << k); mask++) {
        ll prod = 1;
        bool grande = false;
        for (int i = 0; i < k && !grande; i++)
            if (mask >> i & 1) {
                // si el producto pasa de n, ese término vale 0 (se evita el desbordamiento)
                if (prod > n / a[i]) grande = true;
                else prod *= a[i];
            }
        if (grande) continue;
        if (__builtin_popcount(mask) & 1) total += n / prod;
        else total -= n / prod;
    }
    cout << total << "\n";
    return 0;
}
