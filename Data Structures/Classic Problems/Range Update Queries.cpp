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
 * Algoritmo : Fenwick Tree sobre el arreglo de diferencias (suma en rango, consulta puntual)
 * Problema  : CSES 1651 - Range Update Queries (https://cses.fi/problemset/task/1651)
 * Entrada   : n q, n enteros, luego q consultas "1 a b u" (sumar u a [a, b]) o "2 k" (valor en k)
 * Salida    : el valor pedido en cada consulta de tipo 2
 * Complejidad: tiempo O((n + q) log n), memoria O(n)
 */

int n;
vector<ll> bit;
void add(int i, ll v) { for (; i <= n; i += i & -i) bit[i] += v; }
ll sum(int i) { ll s = 0; for (; i > 0; i -= i & -i) s += bit[i]; return s; }

int main() {
    fastio;
    int q;
    cin >> n >> q;
    vector<ll> x(n + 1);
    for (int i = 1; i <= n; i++) cin >> x[i];
    // bit guarda diferencias: sumar u a [a, b] es +u en a y -u en b+1
    bit.assign(n + 2, 0);
    while (q--) {
        int t;
        cin >> t;
        if (t == 1) {
            int a, b; ll u;
            cin >> a >> b >> u;
            add(a, u);
            if (b + 1 <= n) add(b + 1, -u);
        } else {
            int k;
            cin >> k;
            // el valor actual es el original más todo lo acumulado hasta k
            cout << x[k] + sum(k) << "\n";
        }
    }
    return 0;
}
