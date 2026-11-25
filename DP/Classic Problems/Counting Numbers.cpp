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
 * Algoritmo : DP de dígitos (contar números con una propiedad hasta un límite)
 * Problema  : CSES 2220 - Counting Numbers (https://cses.fi/problemset/task/2220)
 * Entrada   : dos enteros a y b
 * Salida    : cantidad de enteros en [a, b] sin dos dígitos vecinos iguales
 * Complejidad: tiempo O(10 · dígitos), memoria O(dígitos)
 */

// cuenta los enteros en [0, x] sin dos dígitos vecinos iguales
ll contar(ll x) {
    if (x < 0) return 0;
    if (x == 0) return 1;
    string s = to_string(x);
    int n = s.size();
    vector<ll> p9(n + 1, 1);
    for (int i = 1; i <= n; i++) p9[i] = p9[i - 1] * 9;
    ll res = 1;  // el número 0
    // números con menos dígitos: primer dígito 1..9 y cada siguiente distinto al anterior (9 opciones)
    for (int len = 1; len < n; len++) res += p9[len];
    // números con n dígitos menores que x: se copia un prefijo de x y en la posición i se pone un dígito menor
    for (int i = 0; i < n; i++) {
        int lim = s[i] - '0';
        for (int d = (i == 0 ? 1 : 0); d < lim; d++)
            if (i == 0 || d != s[i - 1] - '0') res += p9[n - 1 - i];
        // si x ya tiene dos dígitos vecinos iguales, ningún número con este prefijo sirve
        if (i > 0 && s[i] == s[i - 1]) return res;
    }
    return res + 1;  // x mismo es válido
}

int main() {
    fastio;
    ll a, b;
    cin >> a >> b;
    cout << contar(b) - contar(a - 1) << "\n";
    return 0;
}
