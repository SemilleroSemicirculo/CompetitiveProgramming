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
 * Algoritmo : Distribución geométrica y coleccionista de cupones (E = n · H_n)
 * Problema  : Sin problema equivalente en CSES; formato propio
 * Entrada   : n t (n tipos de cupón igual de probables, t compras; n, t ≤ 1000)
 * Salida    : el número esperado de compras para tener los n tipos, y la probabilidad de tenerlos todos en ≤ t compras
 * Complejidad: tiempo O(n · t), memoria O(n)
 */

int main() {
    fastio;
    int n, t;
    cin >> n >> t;
    // con c tipos ya vistos, cada compra trae uno nuevo con probabilidad (n − c)/n:
    // esperar el siguiente nuevo es una geométrica de esperanza n/(n − c)
    double E = 0;
    for (int c = 0; c < n; c++) E += (double)n / (n - c);   // = n · (1 + 1/2 + … + 1/n)
    // d[c] = P(haber visto exactamente c tipos tras las compras hechas): cadena de Markov en c
    vector<double> d(n + 1, 0.0);
    d[0] = 1.0;
    for (int s = 0; s < t; s++)
        for (int c = n; c >= 0; c--)
            d[c] = d[c] * c / n + (c ? d[c - 1] * (n - c + 1) / n : 0.0);
    precision(9);
    cout << E << "\n" << d[n] << "\n";
    return 0;
}
