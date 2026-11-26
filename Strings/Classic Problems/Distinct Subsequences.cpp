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
 * Algoritmo : DP para contar subsecuencias distintas
 * Problema  : CSES 1149 - Distinct Subsequences (https://cses.fi/problemset/task/1149)
 * Entrada   : una cadena de largo n
 * Salida    : cantidad de subsecuencias distintas no vacías, módulo 10^9+7
 * Complejidad: tiempo O(n), memoria O(1)
 */

const ll M = 1e9 + 7;

int main() {
    fastio;
    string s;
    cin >> s;
    // total = subsecuencias distintas (incluida la vacía) del prefijo leído
    // last[c] = valor de total justo antes de la última vez que apareció c
    ll total = 1;
    vector<ll> last(26, 0);
    for (char ch : s) {
        int c = ch - 'a';
        // cada subsecuencia puede o no terminar con este caracter: se duplica el total,
        // pero las que ya terminaban en c se habrían contado dos veces
        ll nuevo = (2 * total - last[c] + M) % M;
        last[c] = total;
        total = nuevo;
    }
    cout << (total - 1 + M) % M << "\n";  // se quita la subsecuencia vacía
    return 0;
}
