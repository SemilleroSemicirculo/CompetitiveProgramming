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
 * Algoritmo : Producto cruz (orientación de tres puntos)
 * Problema  : CSES 2189 - Point Location Test (https://cses.fi/problemset/task/2189)
 * Entrada   : t, luego t líneas "x1 y1 x2 y2 x3 y3"
 * Salida    : LEFT, RIGHT o TOUCH según dónde queda p3 respecto a la recta p1 -> p2
 * Complejidad: tiempo O(1) por caso, memoria O(1)
 */

int main() {
    fastio;
    int t;
    cin >> t;
    while (t--) {
        ll x1, y1, x2, y2, x3, y3;
        cin >> x1 >> y1 >> x2 >> y2 >> x3 >> y3;
        // cruz de (p2 - p1) con (p3 - p1): positivo = giro a la izquierda, negativo = a la derecha
        // los valores llegan a ~8·10^18, que todavía cabe en long long
        ll cr = (x2 - x1) * (y3 - y1) - (y2 - y1) * (x3 - x1);
        cout << (cr > 0 ? "LEFT" : cr < 0 ? "RIGHT" : "TOUCH") << "\n";
    }
    return 0;
}
