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
 * Algoritmo : Sparse Table (mínimo de rango en O(1))
 * Problema  : CSES 1647 - Static Range Minimum Queries (https://cses.fi/problemset/task/1647)
 * Entrada   : n q, n enteros, luego q consultas "a b"
 * Salida    : el mínimo de cada rango
 * Complejidad: tiempo O(n log n + q), memoria O(n log n)
 */

struct SparseTable {
    int n, LOG;
    vector<vector<ll>> st;

    SparseTable(const vector<ll> &a) {
        n = a.size();
        LOG = 32 - __builtin_clz(n);
        st.assign(LOG, vector<ll>(n));
        st[0] = a;
        for (int j = 1; j < LOG; j++)
            for (int i = 0; i + (1 << j) <= n; i++)
                st[j][i] = min(st[j - 1][i], st[j - 1][i + (1 << (j - 1))]);
    }

    // minimo en el rango [l..r] (0-indexado), O(1)
    ll query(int l, int r) {
        int j = 31 - __builtin_clz(r - l + 1);
        return min(st[j][l], st[j][r - (1 << j) + 1]);
    }
};

int main() {
    fastio;
    int n, q;
    cin >> n >> q;
    vector<ll> a(n);
    for (auto &x : a) cin >> x;

    SparseTable table(a);
    while (q--) {
        int l, r; cin >> l >> r;
        l--; r--;
        cout << table.query(l, r) << "\n";
    }
    return 0;
}
