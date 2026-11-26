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
 * Algoritmo : Base lineal sobre GF(2) (base xor): eliminación de Gauss con bits
 * Problema  : SPOJ XMAX - XOR Maximization (https://www.spoj.com/problems/XMAX/)
 * Entrada   : N; luego N enteros a_i (0 ≤ a_i ≤ 10^18)
 * Salida    : el máximo xor que se puede obtener con algún subconjunto
 * Complejidad: tiempo O(N · B) con B = 60 bits, memoria O(B)
 */

const int B = 60;
ll base[B];   // base[b] = vector de la base cuyo bit más alto es b (0 si no hay)

// intenta agregar x: se le quitan los bits altos que ya tienen representante
bool insertar(ll x) {
    for (int b = B - 1; b >= 0; b--) {
        if (!(x >> b & 1)) continue;
        if (!base[b]) { base[b] = x; return true; }   // nuevo vector independiente
        x ^= base[b];
    }
    return false;   // x ya era combinación de la base
}

int main() {
    fastio;
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) { ll x; cin >> x; insertar(x); }
    // goloso de arriba hacia abajo: prender cada bit alto si se puede, sin importar los bajos
    ll res = 0;
    for (int b = B - 1; b >= 0; b--) res = max(res, res ^ base[b]);
    cout << res << "\n";
    return 0;
}
