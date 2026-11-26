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
 * Algoritmo : DP de intervalos (juego de dos jugadores, minimax)
 * Problema  : CSES 1097 - Removal Game (https://cses.fi/problemset/task/1097)
 * Entrada   : n, luego n enteros
 * Salida    : puntaje máximo del primer jugador si ambos juegan óptimamente
 * Complejidad: tiempo O(n^2), memoria O(n)
 */

int main() {
    fastio;
    int n;
    cin >> n;
    vector<ll> x(n);
    ll total = 0;
    for (auto &v : x) cin >> v, total += v;
    // d[l] (para el largo actual) = (mi puntaje - puntaje del rival) jugando primero en x[l..l+len-1]
    vector<ll> d(x);  // largo 1: tomo el único número
    for (int len = 2; len <= n; len++)
        for (int l = 0; l + len <= n; l++) {
            int r = l + len - 1;
            // tomo x[l] y el rival juega en [l+1, r], o tomo x[r] y el rival juega en [l, r-1]
            d[l] = max(x[l] - d[l + 1], x[r] - d[l]);
        }
    // mío + rival = total y mío - rival = d[0]
    cout << (total + d[0]) / 2 << "\n";
    return 0;
}
