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
 * Algoritmo : Factorización con Pollard rho (variante de Brent) + Miller-Rabin (basado en KACTL, CC0)
 * Problema  : Library Checker - Factorize (https://judge.yosupo.jp/problem/factorize)
 * Entrada   : Q, luego Q números a (1 ≤ a ≤ 10^18)
 * Salida    : por cada a, la cantidad de factores primos (con repetición) y los factores en orden
 * Complejidad: tiempo esperado O(n^(1/4)) por factor encontrado, memoria O(log n)
 */

typedef unsigned long long ull;

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
    ull d = n - 1;
    int s = 0;
    while (d % 2 == 0) d /= 2, s++;
    for (ull a : {2, 325, 9375, 28178, 450775, 9780504, 1795265022}) {
        ull x = powmod(a, d, n);
        if (x == 0 || x == 1 || x == n - 1) continue;
        bool testigo = true;
        for (int i = 1; i < s && testigo; i++) {
            x = mulmod(x, x, n);
            if (x == n - 1) testigo = false;
        }
        if (testigo) return false;
    }
    return true;
}

mt19937_64 rng(chrono::steady_clock::now().time_since_epoch().count());

// devuelve un divisor propio de n (n compuesto e impar)
ull rho(ull n) {
    while (true) {
        ull c = rng() % (n - 1) + 1, y = rng() % n, x, q = 1, g = 1, ys;
        auto f = [&](ull v) { return (mulmod(v, v, n) + c) % n; };   // pseudoaleatoria x² + c
        // Brent: x se queda fijo mientras y avanza r pasos; los |x − y| se multiplican en
        // bloques de 128 para hacer un solo gcd por bloque
        for (ull r = 1; g == 1; r <<= 1) {
            x = y;
            for (ull i = 0; i < r; i++) y = f(y);
            for (ull k = 0; k < r && g == 1; k += 128) {
                ys = y;
                for (ull i = 0; i < min((ull)128, r - k); i++) {
                    y = f(y);
                    q = mulmod(q, x > y ? x - y : y - x, n);
                }
                g = __gcd(q, n);
            }
        }
        if (g == n) {   // el bloque se pasó: se repite paso a paso desde ys
            do {
                ys = f(ys);
                g = __gcd(x > ys ? x - ys : ys - x, n);
            } while (g == 1);
        }
        if (g != n) return g;   // si aun así salió n, se prueba con otra c
    }
}

void factor(ull n, vector<ull> &out) {
    if (n == 1) return;
    if (n % 2 == 0) { out.push_back(2); factor(n / 2, out); return; }
    if (is_prime(n)) { out.push_back(n); return; }
    ull d = rho(n);
    factor(d, out);
    factor(n / d, out);
}

int main() {
    fastio;
    int Q;
    cin >> Q;
    while (Q--) {
        ull a;
        cin >> a;
        vector<ull> f;
        factor(a, f);
        sort(all(f));
        cout << f.size();
        for (ull p : f) cout << " " << p;
        cout << "\n";
    }
    return 0;
}
