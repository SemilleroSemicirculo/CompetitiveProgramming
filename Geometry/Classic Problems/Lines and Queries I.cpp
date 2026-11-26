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
 * Algoritmo : Li Chao Tree (máximo entre rectas en un punto)
 * Problema  : CSES 3429 - Lines and Queries I (https://cses.fi/problemset/task/3429)
 * Entrada   : n, luego n consultas "1 a b" (agregar la recta ax + b) o "2 x" (máximo en x)
 * Salida    : la respuesta de cada consulta de tipo 2
 * Complejidad: tiempo O(n log X) con X = 10^5, memoria O(X)
 */

const int X = 100001;  // x va de 0 a 10^5
struct Line { ll a, b; ll f(ll x) const { return a * x + b; } };
vector<Line> t(4 * X, {0, -INF});
vector<bool> has(4 * X, false);

// cada nodo guarda la recta que gana en el centro de su tramo; la perdedora baja al lado donde podría ganar
void add(Line ln, int v = 1, int l = 0, int r = X - 1) {
    if (!has[v]) { t[v] = ln; has[v] = true; return; }
    int m = (l + r) / 2;
    bool winL = ln.f(l) > t[v].f(l), winM = ln.f(m) > t[v].f(m);
    if (winM) swap(ln, t[v]);           // el nodo se queda con la mejor en el centro
    if (l == r) return;
    // dos rectas se cruzan a lo sumo una vez: la perdedora solo puede ganar en una mitad
    if (winL != winM) add(ln, 2 * v, l, m);
    else add(ln, 2 * v + 1, m + 1, r);
}

ll query(int x, int v = 1, int l = 0, int r = X - 1) {
    if (!has[v]) return -INF;
    ll res = t[v].f(x);
    if (l == r) return res;
    int m = (l + r) / 2;
    return max(res, x <= m ? query(x, 2 * v, l, m) : query(x, 2 * v + 1, m + 1, r));
}

int main() {
    fastio;
    int n;
    cin >> n;
    while (n--) {
        int ty;
        cin >> ty;
        if (ty == 1) { ll a, b; cin >> a >> b; add({a, b}); }
        else { int x; cin >> x; cout << query(x) << "\n"; }
    }
    return 0;
}
