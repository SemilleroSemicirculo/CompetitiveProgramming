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
 * Algoritmo : Test de primalidad de Miller-Rabin determinista para n < 2^64 (basado en KACTL, CC0)
 * Problema  : Library Checker - Primality Test (https://judge.yosupo.jp/problem/primality_test)
 * Entrada   : Q, luego Q números N (1 ≤ N ≤ 10^18)
 * Salida    : "Yes" si N es primo y "No" si no, uno por línea
 * Complejidad: tiempo O(7 · log N) multiplicaciones por consulta, memoria O(1)
 */

typedef unsigned long long ull;

// a·b mód m sin desbordar: el producto se hace en 128 bits
ull mulmod(ull a, ull b, ull m) { return (unsigned __int128)a * b % m; }

ull powmod(ull b, ull e, ull m) {
    ull r = 1;
    for (b %= m; e; e >>= 1, b = mulmod(b, b, m))
        if (e & 1) r = mulmod(r, b, m);
    return r;
}

bool is_prime(ull n) {
    if (n < 2) return false;
    for (ull p : {2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37})
        if (n % p == 0) return n == p;
    // n − 1 = d · 2^s con d impar
    ull d = n - 1;
    int s = 0;
    while (d % 2 == 0) d /= 2, s++;
    // con estas 7 bases el test no se equivoca para ningún n < 2^64
    for (ull a : {2, 325, 9375, 28178, 450775, 9780504, 1795265022}) {
        ull x = powmod(a, d, n);
        if (x == 0 || x == 1 || x == n - 1) continue;   // a ≡ 0 (mód n) no prueba nada
        bool testigo = true;   // ¿a demuestra que n es compuesto?
        for (int i = 1; i < s && testigo; i++) {
            x = mulmod(x, x, n);
            if (x == n - 1) testigo = false;
        }
        if (testigo) return false;
    }
    return true;
}

int main() {
    fastio;
    int Q;
    cin >> Q;
    while (Q--) {
        ull n;
        cin >> n;
        cout << (is_prime(n) ? "Yes" : "No") << "\n";
    }
    return 0;
}
