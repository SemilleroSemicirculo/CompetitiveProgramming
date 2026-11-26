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
 * Algoritmo : Conectividad dinámica offline: divide y vencerás sobre el tiempo + DSU con deshacer
 * Problema  : CSES 2133 - Dynamic Connectivity (https://cses.fi/problemset/task/2133)
 * Entrada   : n m k; m aristas iniciales; k eventos "1 a b" (agregar arista) o "2 a b" (quitarla)
 * Salida    : la cantidad de componentes al inicio y después de cada evento
 * Complejidad: tiempo O((m + k) log k log n), memoria O(m + k)
 */

// DSU sin compresión de caminos (para poder deshacer), con unión por tamaño: find es O(log n)
vector<int> par, sz_;
vector<pair<int, int>> hist;   // (nodo colgado, raíz que recibió) para deshacer
int comps;
int find(int x) { while (par[x] != x) x = par[x]; return x; }
void unir(int a, int b) {
    a = find(a); b = find(b);
    if (a == b) return;
    if (sz_[a] < sz_[b]) swap(a, b);
    par[b] = a; sz_[a] += sz_[b]; comps--;
    hist.push_back({b, a});
}
void deshacer(size_t hasta) {
    while (hist.size() > hasta) {
        auto [b, a] = hist.back(); hist.pop_back();
        par[b] = b; sz_[a] -= sz_[b]; comps++;
    }
}

int T;
vector<vector<pair<int, int>>> seg;   // segment tree sobre el tiempo: aristas vivas en todo el nodo
vector<int> res;
void agregar(int u, int l, int r, int a, int b, pair<int, int> e) {   // la arista vive en [a, b]
    if (b < l || r < a) return;
    if (a <= l && r <= b) { seg[u].push_back(e); return; }
    int m = (l + r) / 2;
    agregar(2 * u, l, m, a, b, e);
    agregar(2 * u + 1, m + 1, r, a, b, e);
}
// recorrido DFS del árbol del tiempo: al bajar se unen las aristas del nodo; al subir se deshacen
void resolver(int u, int l, int r) {
    size_t marca = hist.size();
    for (auto [a, b] : seg[u]) unir(a, b);
    if (l == r) res[l] = comps;
    else { int m = (l + r) / 2; resolver(2 * u, l, m); resolver(2 * u + 1, m + 1, r); }
    deshacer(marca);
}

int main() {
    fastio;
    int n, m, k;
    cin >> n >> m >> k;
    T = k + 1;   // momentos 0 … k (0 = antes de los eventos)
    map<pair<int, int>, int> desde;   // arista viva → momento en que apareció
    for (int i = 0; i < m; i++) { int a, b; cin >> a >> b; if (a > b) swap(a, b); desde[{a, b}] = 0; }
    seg.assign(4 * T, {});
    for (int t = 1; t <= k; t++) {
        int tipo, a, b;
        cin >> tipo >> a >> b;
        if (a > b) swap(a, b);
        if (tipo == 1) desde[{a, b}] = t;
        else { agregar(1, 0, T - 1, desde[{a, b}], t - 1, {a, b}); desde.erase({a, b}); }
    }
    for (auto [e, t] : desde) agregar(1, 0, T - 1, t, T - 1, e);   // las que nunca se quitan
    par.resize(n + 1); sz_.assign(n + 1, 1);
    iota(all(par), 0);
    comps = n;
    res.assign(T, 0);
    resolver(1, 0, T - 1);
    for (int t = 0; t < T; t++) cout << res[t] << " \n"[t == T - 1];
    return 0;
}
