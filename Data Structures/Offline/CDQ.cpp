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
 * Algoritmo : Divide y vencerás de CDQ (dominancia en 3D: una dimensión por orden, otra por mezcla y otra con Fenwick)
 * Problema  : Luogu P3810 - 三维偏序 (https://www.luogu.com.cn/problem/P3810)
 * Entrada   : n k; luego n triples "a b c" (1 ≤ a, b, c ≤ k)
 * Salida    : para d = 0 … n − 1, cuántos puntos i tienen exactamente d puntos j ≠ i con a_j ≤ a_i, b_j ≤ b_i, c_j ≤ c_i
 * Complejidad: tiempo O(n log n log k), memoria O(n + k)
 */

struct P { int a, b, c, cnt, ans; };
vector<P> p, tmp;
vector<int> bit;
int K;
void add(int i, int v) { for (; i <= K; i += i & -i) bit[i] += v; }
int qry(int i) { int s = 0; for (; i > 0; i -= i & -i) s += bit[i]; return s; }

// los puntos de [l, r) ya están ordenados por a; al terminar quedan ordenados por b
void cdq(int l, int r) {
    if (r - l <= 1) return;
    int m = (l + r) / 2;
    cdq(l, m); cdq(m, r);
    // cada punto de la derecha cuenta los de la izquierda (que tienen a menor o igual) con b ≤ y c ≤:
    // se mezclan por b y los c de la izquierda van al Fenwick
    int i = l, k = l;
    for (int j = m; j < r; j++) {
        while (i < m && p[i].b <= p[j].b) { add(p[i].c, p[i].cnt); tmp[k++] = p[i++]; }
        p[j].ans += qry(p[j].c);
        tmp[k++] = p[j];
    }
    for (int t = l; t < i; t++) add(p[t].c, -p[t].cnt);   // limpiar el Fenwick
    while (i < m) tmp[k++] = p[i++];
    for (int t = l; t < r; t++) p[t] = tmp[t];
}

int main() {
    fastio;
    int n;
    cin >> n >> K;
    vector<array<int, 3>> v(n);
    for (auto &x : v) cin >> x[0] >> x[1] >> x[2];
    sort(all(v));
    // los puntos repetidos se juntan: se dominan entre sí, así que se cuentan aparte
    for (int i = 0; i < n;) {
        int j = i;
        while (j < n && v[j] == v[i]) j++;
        p.push_back({v[i][0], v[i][1], v[i][2], j - i, 0});
        i = j;
    }
    tmp.resize(p.size());
    bit.assign(K + 1, 0);
    cdq(0, p.size());
    vector<int> res(n, 0);
    for (auto &x : p) res[x.ans + x.cnt - 1] += x.cnt;   // + los repetidos menos él mismo
    for (int d = 0; d < n; d++) cout << res[d] << "\n";
    return 0;
}
