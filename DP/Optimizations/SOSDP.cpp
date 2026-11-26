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
 * Algoritmo : DP sobre subconjuntos (SOS: suma sobre subconjuntos y superconjuntos)
 * Problema  : CSES 1654 - Bit Problem (https://cses.fi/problemset/task/1654)
 * Entrada   : n; los números x_1 … x_n (0 ≤ x_i < 2^20)
 * Salida    : por cada x: cuántos y cumplen x | y = x, cuántos x & y = x y cuántos x & y ≠ 0
 * Complejidad: tiempo O(B · 2^B + n) con B = 20, memoria O(2^B)
 */

const int B = 20;

int main() {
    fastio;
    int n;
    cin >> n;
    vector<int> x(n);
    vector<int> sub(1 << B, 0), sup(1 << B, 0);
    for (int &v : x) { cin >> v; sub[v]++; sup[v]++; }
    // después de procesar el bit b, sub[m] cuenta los y ⊆ m que difieren de m solo en bits ≤ b
    for (int b = 0; b < B; b++)
        for (int m = 0; m < (1 << B); m++)
            if (m >> b & 1) {
                sub[m] += sub[m ^ (1 << b)];   // y ⊆ m: el bit b puede estar apagado
                sup[m ^ (1 << b)] += sup[m];   // y ⊇ m: el bit b puede estar prendido
            }
    const int FULL = (1 << B) - 1;
    for (int v : x)
        // x & y ≠ 0  ⟺  y no es subconjunto del complemento de x
        cout << sub[v] << " " << sup[v] << " " << n - sub[FULL ^ v] << "\n";
    return 0;
}
