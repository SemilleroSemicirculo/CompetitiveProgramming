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
 * Algoritmo : Algoritmo de Mo (consultas offline con raíz cuadrada)
 * Problema  : CSES 1734 - Distinct Values Queries (https://cses.fi/problemset/task/1734)
 * Entrada   : n q, n enteros, luego q consultas "a b"
 * Salida    : cantidad de valores distintos en cada rango [a, b]
 * Complejidad: tiempo O((n + q) √n), memoria O(n)
 */

int main() {
    fastio;
    int n, q;
    cin >> n >> q;
    vector<int> a(n);
    for (auto &x : a) cin >> x;
    // comprimir valores
    vector<int> vals = a;
    sort(all(vals));
    vals.erase(unique(all(vals)), vals.end());
    for (auto &x : a) x = lower_bound(all(vals), x) - vals.begin();

    int block = max(1, (int)sqrt(n));
    vector<array<int, 3>> queries(q);  // {l, r, índice}
    for (int i = 0; i < q; i++) {
        cin >> queries[i][0] >> queries[i][1];
        queries[i][0]--, queries[i][1]--;
        queries[i][2] = i;
    }
    sort(all(queries), [&](const array<int, 3> &x, const array<int, 3> &y) {
        int bx = x[0] / block, by = y[0] / block;
        if (bx != by) return bx < by;
        return (bx & 1) ? x[1] > y[1] : x[1] < y[1];
    });

    vector<int> cnt(vals.size(), 0), ans(q);
    int distinct = 0, L = 0, R = -1;
    auto add = [&](int i) { if (cnt[a[i]]++ == 0) distinct++; };
    auto del = [&](int i) { if (--cnt[a[i]] == 0) distinct--; };
    for (auto &[l, r, id] : queries) {
        while (L > l) add(--L);
        while (R < r) add(++R);
        while (L < l) del(L++);
        while (R > r) del(R--);
        ans[id] = distinct;
    }
    for (int x : ans) cout << x << "\n";
    return 0;
}
