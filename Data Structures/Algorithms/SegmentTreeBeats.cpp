#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef long double ld;
const ll INF = numeric_limits<ll>::max() / 4;   // deja margen para INF + w sin desbordar

#define all(x) x.begin(), x.end()
#define rall(x) x.rbegin(), x.rend()
#define MOD 998244353
#define pi acos(-1)
#define gcd __gcd
inline ll lcm(ll a, ll b) { return a / __gcd(a, b) * b; }   // divide antes de multiplicar
#define precision(n) cout << fixed << setprecision(n)
#define debug(arr) do { cerr << #arr << " = "; for (auto &x : arr) cerr << x << " "; cerr << endl; } while (0)
#define fastio ios::sync_with_stdio(0); cin.tie(0); cout.tie(0);
/*
 * Algoritmo : Segment Tree Beats (a_i = min(a_i, t) en rangos, con máximo y suma)
 * Problema  : HDU 5306 - Gorgeous Sequence (https://acm.hdu.edu.cn/showproblem.php?pid=5306)
 * Entrada   : T casos; cada uno n m, el arreglo y m operaciones "0 x y t" (chmin), "1 x y" (máximo), "2 x y" (suma)
 * Salida    : la respuesta de cada operación 1 y 2
 * Complejidad: tiempo O((n + m) log n) amortizado, memoria O(n)
 */

int n;
vector<ll> mx1, mx2, cmx, sm;   // máximo, segundo máximo estricto, cuántos valen el máximo, suma

void pull(int u) {
    int l = 2 * u, r = 2 * u + 1;
    sm[u] = sm[l] + sm[r];
    if (mx1[l] == mx1[r]) { mx1[u] = mx1[l]; cmx[u] = cmx[l] + cmx[r]; mx2[u] = max(mx2[l], mx2[r]); }
    else if (mx1[l] > mx1[r]) { mx1[u] = mx1[l]; cmx[u] = cmx[l]; mx2[u] = max(mx2[l], mx1[r]); }
    else { mx1[u] = mx1[r]; cmx[u] = cmx[r]; mx2[u] = max(mx1[l], mx2[r]); }
}
// aplicar min(·, t) a un nodo cuyo segundo máximo es < t: solo bajan los que valían el máximo
void aplicar(int u, ll t) {
    if (mx1[u] <= t) return;
    sm[u] -= (mx1[u] - t) * cmx[u];
    mx1[u] = t;
}
void push(int u) { aplicar(2 * u, mx1[u]); aplicar(2 * u + 1, mx1[u]); }   // la marca es el propio máximo
void build(int u, int l, int r, const vector<ll> &a) {
    if (l == r) { mx1[u] = sm[u] = a[l]; mx2[u] = -1; cmx[u] = 1; return; }
    int m = (l + r) / 2;
    build(2 * u, l, m, a); build(2 * u + 1, m + 1, r, a);
    pull(u);
}
void chmin(int u, int l, int r, int a, int b, ll t) {
    if (b < l || r < a || mx1[u] <= t) return;          // nada que cambiar
    if (a <= l && r <= b && mx2[u] < t) { aplicar(u, t); return; }   // solo cambia el máximo: O(1)
    push(u);                                            // si no, se baja ("beats")
    int m = (l + r) / 2;
    chmin(2 * u, l, m, a, b, t); chmin(2 * u + 1, m + 1, r, a, b, t);
    pull(u);
}
ll qmax(int u, int l, int r, int a, int b) {
    if (b < l || r < a) return LLONG_MIN;
    if (a <= l && r <= b) return mx1[u];
    push(u);
    int m = (l + r) / 2;
    return max(qmax(2 * u, l, m, a, b), qmax(2 * u + 1, m + 1, r, a, b));
}
ll qsum(int u, int l, int r, int a, int b) {
    if (b < l || r < a) return 0;
    if (a <= l && r <= b) return sm[u];
    push(u);
    int m = (l + r) / 2;
    return qsum(2 * u, l, m, a, b) + qsum(2 * u + 1, m + 1, r, a, b);
}

int main() {
    fastio;
    int T;
    cin >> T;
    while (T--) {
        int m;
        cin >> n >> m;
        vector<ll> a(n + 1);
        for (int i = 1; i <= n; i++) cin >> a[i];
        mx1.assign(4 * n, 0); mx2.assign(4 * n, 0); cmx.assign(4 * n, 0); sm.assign(4 * n, 0);
        build(1, 1, n, a);
        while (m--) {
            int op, x, y;
            cin >> op >> x >> y;
            if (op == 0) { ll t; cin >> t; chmin(1, 1, n, x, y, t); }
            else if (op == 1) cout << qmax(1, 1, n, x, y) << "\n";
            else cout << qsum(1, 1, n, x, y) << "\n";
        }
    }
    return 0;
}
