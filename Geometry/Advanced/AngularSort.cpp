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
 * Algoritmo : Orden angular exacto (por semiplano y luego producto cruz, sin atan2)
 * Problema  : Library Checker - Sort Points by Argument (https://judge.yosupo.jp/problem/sort_points_by_argument)
 * Entrada   : N; N puntos "x y" enteros
 * Salida    : los puntos ordenados por argumento en (−π, π]; (0, 0) cuenta como argumento 0; empates en cualquier orden
 * Complejidad: tiempo O(N log N), memoria O(N)
 */

// Tres grupos por semiplano: abajo (y < 0), el eje x positivo con el origen (argumento 0) y arriba
// (incluye el eje x negativo, argumento π). Dentro de un grupo, a va antes que b si cross(a, b) > 0.
int main() {
    fastio;
    int n;
    cin >> n;
    vector<pair<ll, ll>> p(n);
    for (auto &[x, y] : p) cin >> x >> y;
    auto clave = [](pair<ll, ll> a) {   // 0: abajo; 1: origen y eje x positivo; 2: arriba (incluye x negativo, ángulo π)
        auto [x, y] = a;
        if (y < 0) return 0;
        if (y == 0 && x >= 0) return 1;
        return 2;
    };
    sort(all(p), [&](pair<ll, ll> a, pair<ll, ll> b) {
        int ka = clave(a), kb = clave(b);
        if (ka != kb) return ka < kb;
        if (ka == 1) return false;   // todos tienen argumento 0
        return a.first * b.second - a.second * b.first > 0;
    });
    for (auto [x, y] : p) cout << x << " " << y << "\n";
    return 0;
}
