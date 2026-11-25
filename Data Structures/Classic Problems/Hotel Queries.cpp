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
 * Algoritmo : Segment Tree de máximos con descenso (primer elemento ≥ x)
 * Problema  : CSES 1143 - Hotel Queries (https://cses.fi/problemset/task/1143)
 * Entrada   : n m, cuartos libres de cada hotel, luego los cuartos que pide cada grupo
 * Salida    : el primer hotel con espacio suficiente para cada grupo (o 0)
 * Complejidad: tiempo O((n + m) log n), memoria O(n)
 */

int sz;
vector<ll> t;  // t[v] = máximo de cuartos libres en el tramo del nodo v

int main() {
    fastio;
    int n, m;
    cin >> n >> m;
    sz = 1;
    while (sz < n) sz <<= 1;
    t.assign(2 * sz, 0);
    for (int i = 0; i < n; i++) cin >> t[sz + i];
    for (int v = sz - 1; v >= 1; v--) t[v] = max(t[2 * v], t[2 * v + 1]);
    while (m--) {
        ll r;
        cin >> r;
        // si ni el máximo alcanza, ningún hotel sirve
        if (t[1] < r) { cout << 0 << ' '; continue; }
        // se baja siempre por el hijo izquierdo si alcanza: así se encuentra el primero
        int v = 1;
        while (v < sz) v = (t[2 * v] >= r) ? 2 * v : 2 * v + 1;
        cout << v - sz + 1 << ' ';
        // se ocupan los cuartos y se recalcula el camino a la raíz
        t[v] -= r;
        for (v >>= 1; v >= 1; v >>= 1) t[v] = max(t[2 * v], t[2 * v + 1]);
    }
    cout << "\n";
    return 0;
}
