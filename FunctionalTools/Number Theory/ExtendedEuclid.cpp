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
 * Algoritmo : Euclides extendido (ecuación diofántica lineal a·x + b·y = c)
 * Problema  : Codeforces 7C - Line (https://codeforces.com/problemset/problem/7/C)
 * Entrada   : A, B, C de la recta A·x + B·y + C = 0 (A² + B² > 0)
 * Salida    : un punto (x, y) con coordenadas enteras sobre la recta, o -1 si no existe
 * Complejidad: tiempo O(log min(|A|, |B|)), memoria O(log) por la recursión
 */

// devuelve g = gcd(a, b) y deja x, y con a·x + b·y = g  (a, b ≥ 0)
ll ext_gcd(ll a, ll b, ll &x, ll &y) {
    if (b == 0) { x = 1; y = 0; return a; }
    ll x1, y1;
    ll g = ext_gcd(b, a % b, x1, y1);
    // b·x1 + (a mod b)·y1 = g  y  a mod b = a − (a/b)·b
    x = y1;
    y = x1 - (a / b) * y1;
    return g;
}

int main() {
    fastio;
    ll A, B, C;
    cin >> A >> B >> C;
    ll x, y;
    ll g = ext_gcd(llabs(A), llabs(B), x, y);   // |A|·x + |B|·y = g
    // A·x + B·y = −C tiene solución entera si y solo si g divide a C
    if (C % g != 0) { cout << -1 << "\n"; return 0; }
    if (A < 0) x = -x;   // ahora A·x + B·y = g
    if (B < 0) y = -y;
    ll k = -C / g;       // multiplicar por −C/g da A·x + B·y = −C
    // |x| ≤ |B|/g y |k| ≤ |C|/g, así que |x·k| ≤ 4·10^18 cabe en long long
    cout << x * k << " " << y * k << "\n";
    return 0;
}
