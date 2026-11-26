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
 * Algoritmo : Probabilidad condicional / teorema de Bayes con DP de conteo de éxitos
 * Problema  : UVa 11181 - Probability|Given
 * Entrada   : varios casos "N r" y N probabilidades p_i; termina con "0 0"
 * Salida    : "Case k:" y, para cada amigo, P(compró | exactamente r compraron), con seis decimales
 * Complejidad: tiempo O(N^3) por caso, memoria O(N)
 */

// d[j] = P(exactamente j compran) entre los amigos indicados por usar
vector<double> conteo(const vector<double> &p, int saltar) {
    int n = p.size();
    vector<double> d(n + 1, 0.0);
    d[0] = 1.0;
    for (int i = 0; i < n; i++) {
        if (i == saltar) continue;
        for (int j = n; j >= 0; j--) d[j] = d[j] * (1 - p[i]) + (j ? d[j - 1] * p[i] : 0.0);
    }
    return d;
}

int main() {
    fastio;
    int n, r, caso = 0;
    while (cin >> n >> r && (n || r)) {
        vector<double> p(n);
        for (auto &x : p) cin >> x;
        // Bayes: P(i compró | r compraron) = P(i compró y r compraron) / P(r compraron)
        double total = conteo(p, -1)[r];
        cout << "Case " << ++caso << ":\n";
        precision(6);
        for (int i = 0; i < n; i++) {
            // i compró y entre los demás compraron exactamente r − 1 (eventos independientes)
            double conjunta = r ? p[i] * conteo(p, i)[r - 1] : 0.0;
            cout << conjunta / total << "\n";
        }
    }
    return 0;
}
