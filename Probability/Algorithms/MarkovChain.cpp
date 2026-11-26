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
 * Algoritmo : Cadena de Markov (distribución tras k pasos) + linealidad de la esperanza
 * Problema  : CSES 1726 - Moving Robots (https://cses.fi/problemset/task/1726)
 * Entrada   : k
 * Salida    : número esperado de casillas vacías de un tablero 8×8 tras k pasos, con seis decimales
 * Complejidad: tiempo O(64 · k · 64), memoria O(64 · 64)
 */

int main() {
    fastio;
    int k;
    cin >> k;
    int dx[] = {1, -1, 0, 0}, dy[] = {0, 0, 1, -1};
    // vacia[c] = probabilidad de que la casilla c quede vacía = Π sobre robots de (1 - P(robot termina en c))
    vector<double> vacia(64, 1.0);
    for (int start = 0; start < 64; start++) {
        // p[c] = probabilidad de que el robot que salió de start esté en c
        vector<double> p(64, 0.0);
        p[start] = 1.0;
        for (int step = 0; step < k; step++) {
            vector<double> q(64, 0.0);
            for (int c = 0; c < 64; c++) {
                if (p[c] == 0) continue;
                int x = c / 8, y = c % 8;
                // el robot elige al azar entre las direcciones que no lo sacan del tablero
                vector<int> vec;
                for (int d = 0; d < 4; d++) {
                    int a = x + dx[d], b = y + dy[d];
                    if (a >= 0 && a < 8 && b >= 0 && b < 8) vec.push_back(a * 8 + b);
                }
                for (int v : vec) q[v] += p[c] / vec.size();
            }
            p = q;
        }
        // los robots se mueven de forma independiente: las probabilidades se multiplican
        for (int c = 0; c < 64; c++) vacia[c] *= 1 - p[c];
    }
    // linealidad: E[vacías] = Σ P(casilla vacía)
    double res = 0;
    for (double v : vacia) res += v;
    precision(6);
    cout << res << "\n";
    return 0;
}
