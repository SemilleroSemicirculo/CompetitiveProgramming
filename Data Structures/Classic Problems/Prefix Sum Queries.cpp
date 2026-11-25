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
 * Algoritmo : Segment Tree con nodos compuestos (suma y mejor prefijo)
 * Problema  : CSES 2166 - Prefix Sum Queries (https://cses.fi/problemset/task/2166)
 * Entrada   : n q, n enteros, luego q consultas "1 k u" (x_k = u) o "2 a b"
 * Salida    : para cada consulta de tipo 2, la máxima suma de un prefijo de [a, b] (el prefijo vacío vale 0)
 * Complejidad: tiempo O((n + q) log n), memoria O(n)
 */

// cada nodo guarda la suma de su tramo y su mejor prefijo (≥ 0 porque se permite el vacío)
struct Node { ll sum, pre; };
// combinar: el mejor prefijo es el de la izquierda, o toda la izquierda más un prefijo de la derecha
Node comb(const Node &a, const Node &b) { return {a.sum + b.sum, max(a.pre, a.sum + b.pre)}; }
const Node NEUTRO = {0, 0};

int sz;
vector<Node> t;

void update(int i, ll v) {
    i += sz;
    t[i] = {v, max(0LL, v)};
    for (i >>= 1; i >= 1; i >>= 1) t[i] = comb(t[2 * i], t[2 * i + 1]);
}

// consulta [l, r) iterativa; el orden importa (comb no es conmutativa), así que se junta por los dos lados
ll query(int l, int r) {
    Node L = NEUTRO, R = NEUTRO;
    for (l += sz, r += sz; l < r; l >>= 1, r >>= 1) {
        if (l & 1) L = comb(L, t[l++]);
        if (r & 1) R = comb(t[--r], R);
    }
    return comb(L, R).pre;
}

int main() {
    fastio;
    int n, q;
    cin >> n >> q;
    sz = n;
    t.assign(2 * n, NEUTRO);
    for (int i = 0; i < n; i++) { ll x; cin >> x; t[sz + i] = {x, max(0LL, x)}; }
    for (int i = sz - 1; i >= 1; i--) t[i] = comb(t[2 * i], t[2 * i + 1]);
    while (q--) {
        int ty; ll a, b;
        cin >> ty >> a >> b;
        if (ty == 1) update(a - 1, b);
        else cout << query(a - 1, b) << "\n";
    }
    return 0;
}
