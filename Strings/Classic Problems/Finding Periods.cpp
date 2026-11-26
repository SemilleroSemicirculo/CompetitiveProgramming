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
 * Algoritmo : Función Z (periodos de una cadena)
 * Problema  : CSES 1733 - Finding Periods (https://cses.fi/problemset/task/1733)
 * Entrada   : una cadena de largo n
 * Salida    : todos los largos de periodo en orden creciente
 * Complejidad: tiempo O(n), memoria O(n)
 */

int main() {
    fastio;
    string s;
    cin >> s;
    int n = s.size();
    // z[i] = largo del mayor prefijo de s que empieza también en la posición i
    vector<int> z(n, 0);
    for (int i = 1, l = 0, r = 0; i < n; i++) {
        if (i < r) z[i] = min(r - i, z[i - l]);  // se reutiliza lo ya comparado en [l, r)
        while (i + z[i] < n && s[z[i]] == s[i + z[i]]) z[i]++;
        if (i + z[i] > r) l = i, r = i + z[i];
    }
    // p es periodo si al correr la cadena p posiciones coincide con el prefijo hasta el final
    for (int p = 1; p < n; p++)
        if (z[p] == n - p) cout << p << ' ';
    cout << n << "\n";  // toda la cadena siempre es un periodo
    return 0;
}
