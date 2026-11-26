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
 * Algoritmo : Probabilidad continua uniforme (probabilidad geométrica: área favorable / área total)
 * Problema  : Sin problema equivalente en CSES; formato propio
 * Entrada   : a b s (x uniforme en [0, a], y uniforme en [0, b], independientes; reales positivos)
 * Salida    : P(x + y ≤ s) con nueve decimales
 * Complejidad: tiempo O(1), memoria O(1)
 */

// área del triángulo {x + y ≤ c, x ≥ 0, y ≥ 0} (0 si c < 0)
double tri(double c) { return c >= 0 ? c * c / 2 : 0; }

int main() {
    fastio;
    double a, b, s;
    cin >> a >> b >> s;
    // (x, y) es un punto uniforme en el rectángulo [0, a] × [0, b] (densidad 1/(a·b)):
    // la probabilidad de un evento es el área de su región dividida entre a·b.
    // Área de {x + y ≤ s} dentro del rectángulo por inclusión-exclusión de triángulos:
    double area = tri(s) - tri(s - a) - tri(s - b) + tri(s - a - b);
    area = max(0.0, min(area, a * b));
    precision(9);
    cout << area / (a * b) << "\n";
    return 0;
}
