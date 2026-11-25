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
 * Algoritmo : DP de subconjuntos con bitset (sumas alcanzables)
 * Problema  : CSES 1745 - Money Sums (https://cses.fi/problemset/task/1745)
 * Entrada   : n, luego n valores de monedas
 * Salida    : cantidad de sumas distintas que se pueden formar y la lista ordenada
 * Complejidad: tiempo O(n · S / 64) con S = suma total, memoria O(S)
 */

int main() {
    fastio;
    int n;
    cin >> n;
    // bit s encendido = la suma s se puede formar con las monedas vistas
    bitset<100001> can;
    can[0] = 1;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        // cada suma vieja s genera s + x (usar o no la moneda)
        can |= can << x;
    }
    vector<int> res;
    for (int s = 1; s <= 100000; s++)
        if (can[s]) res.push_back(s);
    cout << res.size() << "\n";
    for (int s : res) cout << s << ' ';
    cout << "\n";
    return 0;
}
