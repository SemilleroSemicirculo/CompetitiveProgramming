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
            fw.add(k, u - a[k]);
            a[k] = u;
        } else {
            int l, r; cin >> l >> r;
            cout << fw.query(l, r) << "\n";
        }
    }
    return 0;
}
