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
 * Algoritmo : Linealidad de la esperanza (sumar la probabilidad de cada par)
 * Problema  : CSES 1728 - Inversion Probability (https://cses.fi/problemset/task/1728)
 * Entrada   : n, luego r_1 … r_n (x_i es uniforme en [1, r_i])
 * Salida    : número esperado de inversiones, con seis decimales
 * Complejidad: tiempo O(n^2 · R), memoria O(n)
 */

int main() {
    fastio;
    int n;
    cin >> n;
    vector<int> r(n);
    for (auto &x : r) cin >> x;
    // E[inversiones] = Σ_{i<j} P(x_i > x_j): cada par es una variable 0/1 y las esperanzas se suman
    // aunque los pares NO sean independientes entre sí
    double res = 0;
    for (int i = 0; i < n; i++)
        for (int j = i + 1; j < n; j++) {
            // casos favorables: x_i = v y x_j < v, es decir min(v − 1, r_j) opciones para x_j
            long long fav = 0;
            for (int v = 1; v <= r[i]; v++) fav += min(v - 1, r[j]);
            res += (double)fav / ((double)r[i] * r[j]);
        }
    precision(6);
    cout << res << "\n";
    return 0;
}
