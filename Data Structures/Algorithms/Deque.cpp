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
 * Algoritmo : Deque monótona (mínimo de ventana deslizante)
 * Problema  : CSES 3221 - Sliding Window Minimum (https://cses.fi/problemset/task/3221)
 * Entrada   : n k, luego x a b c con x_i = (a·x_{i-1} + b) mod c
 * Salida    : XOR de los mínimos de todas las ventanas de tamaño k
 * Complejidad: tiempo O(n), memoria O(n)
 */

int main() {
    fastio;
    ll n, k, x, a, b, c;
    cin >> n >> k >> x >> a >> b >> c;
    vector<ll> v(n);
    v[0] = x;
    for (int i = 1; i < n; i++) v[i] = (a * v[i - 1] + b) % c;

    // la deque guarda índices con valores crecientes; el frente es el mínimo de la ventana
    // la deque guarda índices con valores crecientes; el frente es el mínimo de la ventana
    deque<int> d;
    ll res = 0;
    for (int i = 0; i < n; i++) {
        // se descartan los mayores o iguales a v[i]: nunca serán mínimo
        while (!d.empty() && v[d.back()] >= v[i]) d.pop_back();
        d.push_back(i);
        // el frente salió de la ventana
        if (d.front() <= i - k) d.pop_front();
        // la ventana ya tiene k elementos
        if (i >= k - 1) res ^= v[d.front()];
    }
    cout << res << "\n";
    return 0;
}
