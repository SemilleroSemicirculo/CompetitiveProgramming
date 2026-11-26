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
 * Algoritmo : DP de perfil roto (llenar celda por celda guardando una máscara de la frontera)
 * Problema  : CSES 2181 - Counting Tilings (https://cses.fi/problemset/task/2181)
 * Entrada   : n m (1 ≤ n ≤ 10, 1 ≤ m ≤ 1000)
 * Salida    : la cantidad de formas de cubrir una cuadrícula n × m con fichas 1 × 2 y 2 × 1, módulo 10^9 + 7
 * Complejidad: tiempo O(n · m · 2^n), memoria O(2^n)
 */

// Se recorre por columnas y, dentro de cada columna, fila por fila. El bit r de la máscara dice si la celda
// de la fila r en la columna siguiente ya está ocupada por una ficha horizontal que sobresale.
// En cada celda: si ya está ocupada se sigue; si no, se pone una horizontal (marca el bit) o una vertical
// (ocupa también la celda de abajo, que debe estar libre).
int main() {
    fastio;
    int n, m;
    cin >> n >> m;
    const ll MOD7 = 1e9 + 7;
    vector<ll> dp(1 << n, 0), nd(1 << n);
    dp[0] = 1;
    for (int c = 0; c < m; c++) {
        for (int r = 0; r < n; r++) {   // procesar la celda (r, c): el bit r pasa de "esta columna" a "la siguiente"
            fill(all(nd), 0);
            for (int mask = 0; mask < (1 << n); mask++) {
                if (!dp[mask]) continue;
                ll v = dp[mask];
                if (mask >> r & 1) { nd[mask ^ (1 << r)] = (nd[mask ^ (1 << r)] + v) % MOD7; continue; }   // ya ocupada
                nd[mask | (1 << r)] = (nd[mask | (1 << r)] + v) % MOD7;                                   // horizontal
                if (r + 1 < n && !(mask >> (r + 1) & 1))                                                  // vertical
                    nd[mask | (1 << (r + 1))] = (nd[mask | (1 << (r + 1))] + v) % MOD7;
            }
            swap(dp, nd);
        }
    }
    cout << dp[0] << "\n";
    return 0;
}
