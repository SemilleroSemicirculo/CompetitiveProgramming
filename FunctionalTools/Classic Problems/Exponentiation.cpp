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
 * Algoritmo : Exponenciación binaria (rápida) modular
 * Problema  : CSES 1095 - Exponentiation (https://cses.fi/problemset/task/1095)
 * Entrada   : n, luego n pares "a b"
 * Salida    : a^b módulo 10^9+7 para cada par (con 0^0 = 1)
 * Complejidad: tiempo O(log b) por par, memoria O(1)
 */

const ll M = 1e9 + 7;

// se recorre b en binario: base se eleva al cuadrado en cada paso y se multiplica cuando el bit está encendido
ll power(ll base, ll e) {
    ll res = 1;
    base %= M;
    while (e > 0) {
        if (e & 1) res = res * base % M;
        base = base * base % M;
        e >>= 1;
    }
    return res;
}

int main() {
    fastio;
    int n;
    cin >> n;
    while (n--) {
        ll a, b;
        cin >> a >> b;
        cout << power(a, b) << "\n";
    }
    return 0;
}
