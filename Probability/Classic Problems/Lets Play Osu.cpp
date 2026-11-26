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
 * Algoritmo : Esperanza de un cuadrado con linealidad ((L+1)^2 − L^2 = 2L + 1)
 * Problema  : Codeforces 235B - Let's Play Osu! (https://codeforces.com/problemset/problem/235/B)
 * Entrada   : n, luego p_1 … p_n (probabilidad de acertar cada clic)
 * Salida    : puntaje esperado (suma de cuadrados de los bloques de aciertos), error ≤ 10^-6
 * Complejidad: tiempo O(n), memoria O(1)
 */

int main() {
    fastio;
    int n;
    cin >> n;
    // len = E[largo del bloque de aciertos que termina en el clic actual]
    // si el clic i acierta, el bloque crece de L a L+1 y el puntaje sube (L+1)^2 − L^2 = 2L + 1
    double len = 0, res = 0;
    for (int i = 0; i < n; i++) {
        double p;
        cin >> p;
        res += p * (2 * len + 1);   // linealidad: E[2L + 1] = 2·E[L] + 1
        len = p * (len + 1);        // si falla, el bloque vuelve a 0
    }
    precision(12);
    cout << res << "\n";
    return 0;
}
