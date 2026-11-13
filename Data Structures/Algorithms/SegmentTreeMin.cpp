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
 * Algoritmo : Segment Tree iterativo (mínimo de rango y actualización puntual)
 * Problema  : CSES 1649 - Dynamic Range Minimum Queries (https://cses.fi/problemset/task/1649)
 * Entrada   : n q, n enteros, luego q consultas: "1 k u" (a[k] = u) o "2 a b" (mínimo en [a, b])
 * Salida    : el mínimo de cada consulta de tipo 2
 * Complejidad: tiempo O((n + q) log n), memoria O(n)
 */

// árbol iterativo: las hojas están en t[n..2n) y cada padre guarda el mínimo de sus hijos
struct SegmentTree {
    int n;
    vector<ll> t;

    SegmentTree(const vector<ll> &a) {
        n = a.size();
        t.assign(2 * n, INF);
        for (int i = 0; i < n; i++) t[n + i] = a[i];
        for (int i = n - 1; i > 0; i--) t[i] = min(t[2 * i], t[2 * i + 1]);
    }

    // se cambia la hoja y se recalcula hacia la raíz
    void update(int p, ll value) {
        for (t[p += n] = value; p > 1; p >>= 1) t[p >> 1] = min(t[p], t[p ^ 1]);
    }

    // mínimo en [l, r)
    // mínimo en [l, r): se sube juntando los nodos que cubren el rango
    ll query(int l, int r) {
        ll res = INF;
        for (l += n, r += n; l < r; l >>= 1, r >>= 1) {
            if (l & 1) res = min(res, t[l++]);
            if (r & 1) res = min(res, t[--r]);
        }
        return res;
    }
};

int main() {
    fastio;
    int n, q;
    cin >> n >> q;
    vector<ll> a(n);
    for (auto &x : a) cin >> x;
    SegmentTree Tree(a);
    while (q--) {
        int type;
        cin >> type;
        if (type == 1) {
            int k;
            ll u;
            cin >> k >> u;
            Tree.update(k - 1, u);
        }
        else {
            int l, r;
            cin >> l >> r;
            cout << Tree.query(l - 1, r) << "\n";
        }
    }
    return 0;
}
