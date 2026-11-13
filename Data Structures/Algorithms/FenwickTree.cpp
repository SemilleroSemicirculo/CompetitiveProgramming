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
 * Algoritmo : Fenwick Tree (BIT)
 * Problema  : CSES 1648 - Dynamic Range Sum Queries (https://cses.fi/problemset/task/1648)
 * Entrada   : n q, n enteros, luego q consultas: "1 k u" (a[k] = u) o "2 a b" (suma)
 * Salida    : la suma de cada consulta de tipo 2
 * Complejidad: tiempo O((n + q) log n), memoria O(n)
 */

// Fenwick Tree (BIT): bit[i] guarda la suma de un bloque de tamaño (i & -i) que termina en i
struct Fenwick {
    int n;
    vector<ll> bit;

    Fenwick(int n): n(n), bit(n + 1, 0) {}

    // suma v a la posicion i (1-indexado)
    void add(int i, ll v) {
        for (; i <= n; i += i & -i) bit[i] += v;
    }

    // suma del prefijo [1..i]
    ll query(int i) {
        ll res = 0;
        for (; i > 0; i -= i & -i) res += bit[i];
        return res;
    }

    // suma del rango [l..r]
    ll query(int l, int r) {
        return query(r) - query(l - 1);
    }
};

int main() {
    fastio;
    int n, q;
    cin >> n >> q;
    vector<ll> a(n + 1, 0);
    // a[] se guarda aparte para saber cuánto cambiar al actualizar
    Fenwick fw(n);
    for (int i = 1; i <= n; i++) {
        cin >> a[i];
        fw.add(i, a[i]);
    }

    while (q--) {
        int type; cin >> type;
        if (type == 1) {
            // a[k] = u
            int k; ll u; cin >> k >> u;
            // una asignación es sumar la diferencia
            fw.add(k, u - a[k]);
            a[k] = u;
        } else {
            int l, r; cin >> l >> r;
            cout << fw.query(l, r) << "\n";
        }
    }
    return 0;
}
