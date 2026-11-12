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
 * Algoritmo : Dos punteros sobre arreglo ordenado (suma de dos valores)
 * Problema  : CSES 1640 - Sum of Two Values (https://cses.fi/problemset/task/1640)
 * Entrada   : n x, luego n enteros
 * Salida    : dos posiciones (base 1) cuyos valores suman x, o IMPOSSIBLE
 * Complejidad: tiempo O(n log n), memoria O(n)
 */

int main() {
    fastio;
    int n;
    ll x;
    cin >> n >> x;
    vector<pair<ll, int>> a(n);
    for (int i = 0; i < n; i++) {
        cin >> a[i].first;
        a[i].second = i + 1;
    }
    sort(all(a));

    int l = 0, r = n - 1;
    while (l < r) {
        ll s = a[l].first + a[r].first;
        if (s == x) {
            cout << a[l].second << ' ' << a[r].second << "\n";
            return 0;
        }
        if (s < x) l++;
        else r--;
    }
    cout << "IMPOSSIBLE\n";
    return 0;
}
