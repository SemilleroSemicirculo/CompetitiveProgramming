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
 * Algoritmo : Segment Tree con propagación perezosa (suma de rango, asignación y suma de rango)
 * Problema  : CSES 1735 - Range Updates and Sums (https://cses.fi/problemset/task/1735)
 * Entrada   : n q, n enteros, luego q consultas: "1 a b x" (suma x), "2 a b x" (asigna x) o "3 a b" (consulta suma)
 * Salida    : la suma de cada consulta de tipo 3
 * Complejidad: tiempo O((n + q) log n), memoria O(n)
 */

struct Data {
    ll suma, size;
    Data(): suma(0), size(0) {}
    Data(ll s): suma(s), size(1) {}

    Data(const Data &left, const Data &right) {
        suma = left.suma + right.suma;
        size = left.size + right.size;
    }
};

// Primero se asigna "value" (si set) y luego se suma "add"
struct Lazy {
    bool set;
    ll value, add;
    Lazy(): set(false), value(0), add(0) {}

    static Lazy Add(ll v) { Lazy l; l.add = v; return l; }
    static Lazy Set(ll v) { Lazy l; l.set = true; l.value = v; return l; }

    bool empty() const { return !set && add == 0; }

    void updateData(Data &data) const {
        if (set) data.suma = value * data.size;
        data.suma += add * data.size;
    }

    // compone: aplica "other" después de this
    void updateLazy(const Lazy &other) {
        if (other.set) *this = other;
        else add += other.add;
    }
};

struct SegmentTree {
    int n;
    vector<Data> data;
    vector<Lazy> lazy;

    SegmentTree(const vector<ll> &A) {
        n = A.size();
        data.assign(4 * n, Data());
        lazy.assign(4 * n, Lazy());
        build(A, 1, 0, n - 1);
    }

    void build(const vector<ll> &A, int index, int left, int right) {
        if (left == right) { data[index] = Data(A[left]); return; }
        int mid = (left + right) / 2;
        build(A, 2 * index, left, mid);
        build(A, 2 * index + 1, mid + 1, right);
        data[index] = Data(data[2 * index], data[2 * index + 1]);
    }

    void apply(int index, const Lazy &l) {
        l.updateData(data[index]);
        lazy[index].updateLazy(l);
    }

    void propagate(int index) {
        if (lazy[index].empty()) return;
        apply(2 * index, lazy[index]);
        apply(2 * index + 1, lazy[index]);
        lazy[index] = Lazy();
    }

    void update(int index, int left, int right, int lower, int upper, const Lazy &value) {
        if (left > upper || right < lower) return;
        if (lower <= left && right <= upper) { apply(index, value); return; }
        propagate(index);
        int mid = (left + right) / 2;
        update(2 * index, left, mid, lower, upper, value);
        update(2 * index + 1, mid + 1, right, lower, upper, value);
        data[index] = Data(data[2 * index], data[2 * index + 1]);
    }

    ll query(int index, int left, int right, int lower, int upper) {
        if (left > upper || right < lower) return 0;
        if (lower <= left && right <= upper) return data[index].suma;
        propagate(index);
        int mid = (left + right) / 2;
        return query(2 * index, left, mid, lower, upper) + query(2 * index + 1, mid + 1, right, lower, upper);
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
        int type, l, r;
        cin >> type >> l >> r;
        l--, r--;
        if (type == 1) { ll x; cin >> x; Tree.update(1, 0, n - 1, l, r, Lazy::Add(x)); }
        else if (type == 2) { ll x; cin >> x; Tree.update(1, 0, n - 1, l, r, Lazy::Set(x)); }
        else cout << Tree.query(1, 0, n - 1, l, r) << "\n";
    }
    return 0;
}
