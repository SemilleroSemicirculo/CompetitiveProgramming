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
 * Algoritmo : DP de dígitos genérica (posición, estado, ¿sigo pegado al límite?)
 * Problema  : Codeforces 1036C - Classy Numbers (https://codeforces.com/problemset/problem/1036/C)
 * Entrada   : T; luego T consultas L R (1 ≤ L ≤ R ≤ 10^18)
 * Salida    : cuántos números de [L, R] tienen a lo sumo 3 dígitos distintos de cero
 * Complejidad: tiempo O(T · D · K · 10) con D = 19 dígitos y K = 4 estados, memoria O(D · K)
 */

string dig;
ll memo[20][5];

// formas de llenar desde la posición pos con nz dígitos no nulos ya usados;
// tight = true si todo lo anterior coincide con el límite (entonces no se puede pasar de dig[pos])
ll contar(int pos, int nz, bool tight) {
    if (nz > 3) return 0;
    if (pos == (int)dig.size()) return 1;
    if (!tight && memo[pos][nz] != -1) return memo[pos][nz];   // solo se memoriza lo libre
    int lim = tight ? dig[pos] - '0' : 9;
    ll r = 0;
    for (int d = 0; d <= lim; d++) r += contar(pos + 1, nz + (d != 0), tight && d == lim);
    if (!tight) memo[pos][nz] = r;
    return r;
}

// cuántos números en [0, x] cumplen (el 0 cuenta, pero se cancela al restar)
ll f(ll x) {
    if (x < 0) return 0;
    dig = to_string(x);
    memset(memo, -1, sizeof memo);   // memo depende del largo de dig
    return contar(0, 0, true);
}

int main() {
    fastio;
    int T;
    cin >> T;
    while (T--) {
        ll L, R;
        cin >> L >> R;
        cout << f(R) - f(L - 1) << "\n";
    }
    return 0;
}
