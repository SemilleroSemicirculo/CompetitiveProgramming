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
 * Algoritmo : Rotación de 45° (|dx| + |dy| = max(|du|, |dv|) con u = x + y, v = x - y)
 * Problema  : CSES 3410 - Maximum Manhattan Distances (https://cses.fi/problemset/task/3410)
 * Entrada   : n, luego n puntos "x y" que se agregan uno por uno
 * Salida    : después de cada punto, la mayor distancia Manhattan entre dos puntos del conjunto
 * Complejidad: tiempo O(n), memoria O(1)
 */

int main() {
    fastio;
    int n;
    cin >> n;
    // basta conocer el mínimo y el máximo de u = x + y y de v = x - y
    ll minU = INF, maxU = -INF, minV = INF, maxV = -INF;
    while (n--) {
        ll x, y;
        cin >> x >> y;
        ll u = x + y, v = x - y;
        minU = min(minU, u), maxU = max(maxU, u);
        minV = min(minV, v), maxV = max(maxV, v);
        cout << max(maxU - minU, maxV - minV) << "\n";
    }
    return 0;
}
