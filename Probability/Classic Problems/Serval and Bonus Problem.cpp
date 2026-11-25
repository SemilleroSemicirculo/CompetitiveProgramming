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
 * Algoritmo : Probabilidad continua: reducir a órdenes relativos de puntos uniformes + DP modular
 * Problema  : Codeforces 1153F - Serval and Bonus Problem (https://codeforces.com/problemset/problem/1153/F)
 * Entrada   : n k l
 * Salida    : longitud esperada cubierta por al menos k de n segmentos al azar en [0, l], mód 998244353
 * Complejidad: tiempo O(n^2), memoria O(n)
 */

ll power(ll b, ll e) { ll r = 1; b %= MOD; for (; e; e >>= 1, b = b * b % MOD) if (e & 1) r = r * b % MOD; return r; }

int main() {
    fastio;
    int n, k;
    ll l;
    cin >> n >> k >> l;
    // Truco: la longitud esperada cubierta = l · P(un punto x uniforme quede cubierto por ≥ k).
    // Con 2n extremos y x, todos uniformes e independientes, cualquier orden de los 2n + 1 puntos es
    // igual de probable: basta contar órdenes. Se recorren los puntos de izquierda a derecha:
    // f[j][t] = formas con j segmentos abiertos, t = ya se colocó x (0/1).
    vector<array<ll, 2>> f(n + 2, {0, 0}), g(n + 2);
    f[0][0] = 1;
    for (int i = 0; i < 2 * n + 1; i++) {
        for (auto &x : g) x = {0, 0};
        for (int j = 0; j <= n; j++)
            for (int t = 0; t < 2; t++) {
                ll v = f[j][t];
                if (!v) continue;
                if (j < n) g[j + 1][t] = (g[j + 1][t] + v) % MOD;               // abre un segmento
                if (j > 0) g[j - 1][t] = (g[j - 1][t] + v * j) % MOD;           // cierra uno de los j abiertos
                if (t == 0 && j >= k) g[j][1] = (g[j][1] + v) % MOD;            // aquí va x: está cubierto
            }
        swap(f, g);
    }
    // f[0][1] cuenta órdenes con segmentos sin etiqueta y extremos en orden; por cada uno hay
    // n! · 2^n órdenes de los 2n + 1 puntos etiquetados, de un total de (2n + 1)!
    ll num = f[0][1];
    for (int i = 1; i <= n; i++) num = num * i % MOD * 2 % MOD;
    ll den = 1;
    for (int i = 1; i <= 2 * n + 1; i++) den = den * i % MOD;
    cout << num * power(den, MOD - 2) % MOD * (l % MOD) % MOD << "\n";
    return 0;
}
