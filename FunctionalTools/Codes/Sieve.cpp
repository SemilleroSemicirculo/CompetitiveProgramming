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
 * Algoritmo : Criba de Eratóstenes y criba segmentada
 * Problema  : Sin problema equivalente en CSES; formato propio
 * Entrada   : N, luego L R
 * Salida    : primos ≤ N y luego los primos en [L, R]
 * Complejidad: tiempo O(N log log N) y O((R-L) log log R), memoria O(N + R - L)
 */

// Criba de Eratóstenes: marca en `is_prime` los primos ≤ N.
// is_prime[x] queda en true si x es primo
vector<bool> sieve(int N) {
    vector<bool> is_prime(N+1, true);
    is_prime[0] = is_prime[1] = false;
    // solo hace falta tachar múltiplos de primos hasta sqrt(N)
    for (int p = 2; p*p <= N; ++p) {
        if (is_prime[p]) {
            for (int x = p*p; x <= N; x += p)
                is_prime[x] = false;
        }
    }
    return is_prime;
}

// Criba segmentada: devuelve todos los primos en [L..R], dados los primos ≤ sqrt(R).
// criba por segmentos: se tachan los múltiplos de los primos pequeños dentro de [L, R]
vector<ll> segmented_sieve(ll L, ll R) {
    ll lim = floor(sqrt(R));
    auto base = sieve(lim);
    vector<ll> primes;
    for (int i = 2; i <= lim; ++i)
        if (base[i]) primes.push_back(i);

    ll sz = R - L + 1;
    vector<bool> is_prime(sz, true);
    if (L <= 1) {
        for (ll x = L; x <= min(R, 1LL); ++x) is_prime[x - L] = false;
    }
    for (ll p : primes) {
        // primer múltiplo de p dentro del rango (sin tachar a p mismo)
        ll start = max(p*p, ((L + p - 1)/p)*p);
        for (ll x = start; x <= R; x += p)
            is_prime[x - L] = false;
    }

    vector<ll> segment;
    for (ll i = 0; i < sz; ++i) {
        if (is_prime[i]) segment.push_back(L + i);
    }
    return segment;
}

int main() {
    fastio;
    // Ejemplo de uso:
    int N; 
    cin >> N;
    auto small = sieve(N);
    // imprime primos ≤ N
    for (int i = 2; i <= N; ++i)
        if (small[i]) cout << i << ' ';
    cout << '\n';

    ll L, R;
    cin >> L >> R;
    auto seg = segmented_sieve(L, R);
    // imprime primos en [L..R]
    for (ll p : seg) cout << p << ' ';
    cout << '\n';

    return 0;
}
