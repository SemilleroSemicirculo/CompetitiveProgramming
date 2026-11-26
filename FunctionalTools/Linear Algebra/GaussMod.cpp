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
 * Algoritmo : Eliminación de Gauss-Jordan módulo un primo (sistemas de ecuaciones lineales)
 * Problema  : CSES 3154 - System of Linear Equations (https://cses.fi/problemset/task/3154)
 * Entrada   : n m (ecuaciones y variables); luego n filas con m coeficientes y el término b
 * Salida    : una solución x_1 … x_m módulo 10^9 + 7, o -1 si el sistema no tiene solución
 * Complejidad: tiempo O(n · m · min(n, m)), memoria O(n · m)
 */

const ll P = 1000000007;
ll power(ll b, ll e) { ll r = 1; b %= P; for (; e; e >>= 1, b = b * b % P) if (e & 1) r = r * b % P; return r; }

int main() {
    fastio;
    int n, m;
    cin >> n >> m;
    vector<vector<ll>> a(n, vector<ll>(m + 1));   // matriz aumentada [A | b]
    for (auto &row : a) for (ll &x : row) { cin >> x; x %= P; if (x < 0) x += P; }
    vector<int> donde(m, -1);                     // fila donde quedó el pivote de cada variable
    int fila = 0;
    for (int col = 0; col < m && fila < n; col++) {
        int piv = -1;
        for (int i = fila; i < n; i++) if (a[i][col]) { piv = i; break; }   // en módulo p, cualquiera ≠ 0 sirve
        if (piv == -1) continue;                  // variable libre
        swap(a[piv], a[fila]);
        ll inv = power(a[fila][col], P - 2);
        for (ll &x : a[fila]) x = x * inv % P;    // pivote = 1
        for (int i = 0; i < n; i++)               // eliminar la columna en todas las demás filas
            if (i != fila && a[i][col]) {
                ll f = a[i][col];
                for (int j = col; j <= m; j++) a[i][j] = ((a[i][j] - f * a[fila][j]) % P + P) % P;
            }
        donde[col] = fila++;
    }
    // filas que quedaron 0 = b ≠ 0: contradicción
    for (int i = fila; i < n; i++) if (a[i][m]) { cout << -1 << "\n"; return 0; }
    // las variables libres valen 0; cada pivote queda despejado en su fila
    for (int j = 0; j < m; j++) cout << (donde[j] == -1 ? 0 : a[donde[j]][m]) << " \n"[j == m - 1];
    return 0;
}
