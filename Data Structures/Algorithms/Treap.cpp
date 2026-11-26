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
 * Algoritmo : Treap implícito (árbol cartesiano por posición: partir y unir secuencias en O(log n))
 * Problema  : CSES 2072 - Cut and Paste (https://cses.fi/problemset/task/2072)
 * Entrada   : n, m; una cadena de largo n; m operaciones "a b": cortar [a, b] y pegarlo al final
 * Salida    : la cadena final
 * Complejidad: tiempo O((n + m) log n) esperado, memoria O(n)
 */

mt19937 rng(20240601);
struct Nodo {
    char c;
    unsigned pr;      // prioridad aleatoria: el árbol es un heap en pr
    int sz, l, r;     // tamaño del subárbol e hijos (0 = vacío)
};
vector<Nodo> T = {{0, 0, 0, 0, 0}};

int sz(int u) { return u ? T[u].sz : 0; }
void upd(int u) { T[u].sz = 1 + sz(T[u].l) + sz(T[u].r); }

// parte u en (primeros k elementos, el resto); la clave es implícita: la posición
void split(int u, int k, int &a, int &b) {
    if (!u) { a = b = 0; return; }
    if (sz(T[u].l) < k) { split(T[u].r, k - sz(T[u].l) - 1, T[u].r, b); a = u; }
    else { split(T[u].l, k, a, T[u].l); b = u; }
    upd(u);
}

// une a y b (todo a va antes que todo b); sube el de mayor prioridad
int merge(int a, int b) {
    if (!a || !b) return a ? a : b;
    if (T[a].pr > T[b].pr) { T[a].r = merge(T[a].r, b); upd(a); return a; }
    T[b].l = merge(a, T[b].l); upd(b); return b;
}

int main() {
    fastio;
    int n, m;
    string s;
    cin >> n >> m >> s;
    int raiz = 0;
    for (char c : s) {
        T.push_back({c, (unsigned)rng(), 1, 0, 0});
        raiz = merge(raiz, (int)T.size() - 1);
    }
    while (m--) {
        int a, b, x, y, z;
        cin >> a >> b;
        split(raiz, a - 1, x, y);        // x = [1, a−1]
        split(y, b - a + 1, y, z);       // y = [a, b], z = el resto
        raiz = merge(merge(x, z), y);    // el tramo cortado va al final
    }
    // recorrido en orden sin recursión
    string res;
    vector<int> st;
    for (int u = raiz; u || !st.empty();) {
        if (u) { st.push_back(u); u = T[u].l; }
        else { u = st.back(); st.pop_back(); res += T[u].c; u = T[u].r; }
    }
    cout << res << "\n";
    return 0;
}
