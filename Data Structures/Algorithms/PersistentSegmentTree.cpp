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
 * Algoritmo : Segment Tree persistente (cada cambio crea O(log n) nodos nuevos y comparte el resto)
 * Problema  : CSES 1737 - Range Queries and Copies (https://cses.fi/problemset/task/1737)
 * Entrada   : n, q; el arreglo; consultas "1 k a x" (en la copia k, pos a = x), "2 k a b" (suma de
 *             [a, b] en la copia k) o "3 k" (crear una copia de la copia k)
 * Salida    : la respuesta de cada consulta de tipo 2
 * Complejidad: tiempo O((n + q) log n), memoria O(n + q log n)
 */

const int MAXNODOS = 200000 * 2 + 200000 * 20;   // 2n para construir + ~log n por cambio
int L[MAXNODOS], R[MAXNODOS], cnt = 0;           // hijos de cada nodo
ll S[MAXNODOS];                                  // suma del tramo del nodo

int construir(const vector<ll> &a, int l, int r) {
    int u = ++cnt;
    if (l == r) { S[u] = a[l]; return u; }
    int m = (l + r) / 2;
    L[u] = construir(a, l, m);
    R[u] = construir(a, m + 1, r);
    S[u] = S[L[u]] + S[R[u]];
    return u;
}

// devuelve la raíz de una versión NUEVA con a[pos] = x; la versión vieja no se toca
int cambiar(int u, int l, int r, int pos, ll x) {
    int v = ++cnt;
    L[v] = L[u]; R[v] = R[u];                    // se copia el nodo y se comparten los hijos
    if (l == r) { S[v] = x; return v; }
    int m = (l + r) / 2;
    if (pos <= m) L[v] = cambiar(L[u], l, m, pos, x);
    else R[v] = cambiar(R[u], m + 1, r, pos, x);
    S[v] = S[L[v]] + S[R[v]];
    return v;
}

ll suma(int u, int l, int r, int a, int b) {
    if (b < l || r < a) return 0;
    if (a <= l && r <= b) return S[u];
    int m = (l + r) / 2;
    return suma(L[u], l, m, a, b) + suma(R[u], m + 1, r, a, b);
}

int main() {
    fastio;
    int n, q;
    cin >> n >> q;
    vector<ll> a(n + 1);
    for (int i = 1; i <= n; i++) cin >> a[i];
    vector<int> raiz = {0, construir(a, 1, n)};   // raiz[k] = raíz de la copia k
    while (q--) {
        int t, k;
        cin >> t >> k;
        if (t == 1) {
            int p; ll x;
            cin >> p >> x;
            raiz[k] = cambiar(raiz[k], 1, n, p, x);
        } else if (t == 2) {
            int l, r;
            cin >> l >> r;
            cout << suma(raiz[k], 1, n, l, r) << "\n";
        } else raiz.push_back(raiz[k]);             // copiar cuesta O(1): misma raíz
    }
    return 0;
}
