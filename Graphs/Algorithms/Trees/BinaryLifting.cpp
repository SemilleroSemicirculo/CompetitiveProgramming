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
 * Algoritmo : Binary Lifting (ancestro a distancia k)
 * Problema  : CSES 1750 - Planets Queries I (https://cses.fi/problemset/task/1750)
 * Entrada   : n q, luego t_1..t_n (destino de cada planeta) y q consultas "x k"
 * Salida    : el planeta al que se llega desde x tras k teletransportes
 * Complejidad: tiempo O((n + q) log k), memoria O(n log k)
 */

// 2^30 > 10^9, suficiente para k hasta 10^9
const int LOG = 30;

int main() {
    fastio;
    int n, q;
    cin >> n >> q;
    // up[j][v] = nodo al que se llega desde v tras 2^j pasos
    vector<vector<int>> up(LOG, vector<int>(n + 1));
    for (int v = 1; v <= n; v++) cin >> up[0][v];
    // cada nivel sale de duplicar el anterior
    for (int j = 1; j < LOG; j++)
        for (int v = 1; v <= n; v++)
            up[j][v] = up[j - 1][up[j - 1][v]];

    while (q--) {
        int x, k;
        cin >> x >> k;
        for (int j = 0; j < LOG; j++)
            // se descompone k en binario y se salta por cada bit encendido
            if (k >> j & 1) x = up[j][x];
        cout << x << "\n";
    }
    return 0;
}
