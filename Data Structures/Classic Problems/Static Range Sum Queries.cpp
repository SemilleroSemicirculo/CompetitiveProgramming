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
 * Algoritmo : Sumas de prefijos
 * Problema  : CSES 1646 - Static Range Sum Queries (https://cses.fi/problemset/task/1646)
 * Entrada   : n q, n enteros, luego q consultas "a b"
 * Salida    : la suma de cada rango [a, b]
 * Complejidad: tiempo O(n + q), memoria O(n)
 */

int main() {
    fastio;
    int n, q;
    cin >> n >> q;
    // p[i] = x_1 + ... + x_i, con p[0] = 0
    vector<ll> p(n + 1, 0);
    for (int i = 1; i <= n; i++) {
        ll x;
        cin >> x;
        p[i] = p[i - 1] + x;
    }
    while (q--) {
        int a, b;
        cin >> a >> b;
        // la suma de [a, b] es lo que se acumula entre a-1 y b
        cout << p[b] - p[a - 1] << "\n";
    }
    return 0;
}
