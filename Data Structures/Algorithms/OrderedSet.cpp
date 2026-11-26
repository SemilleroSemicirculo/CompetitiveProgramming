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
 * Algoritmo : Conjunto ordenado con k-ésimo elemento (tree de pb_ds, extensión de GNU C++)
 * Problema  : CSES 2163 - Josephus Problem II (https://cses.fi/problemset/task/2163)
 * Entrada   : n, k: n niños en círculo; se salta k niños y se saca el siguiente, repetidamente
 * Salida    : el orden en que salen los niños
 * Complejidad: tiempo O(n log n), memoria O(n)
 */

#include <ext/pb_ds/assoc_container.hpp>
#include <ext/pb_ds/tree_policy.hpp>
using namespace __gnu_pbds;
// árbol rojo-negro que además sabe el tamaño de cada subárbol:
// find_by_order(i) da el i-ésimo menor (desde 0) y order_of_key(x) cuántos son menores que x
template <class T>
using ordered_set = tree<T, null_type, less<T>, rb_tree_tag, tree_order_statistics_node_update>;

int main() {
    fastio;
    int n;
    ll k;
    cin >> n >> k;
    ordered_set<int> s;
    for (int i = 1; i <= n; i++) s.insert(i);
    ll pos = 0;   // índice (desde 0) del niño desde el que se empieza a contar
    while (!s.empty()) {
        pos = (pos + k) % s.size();      // saltar k niños dentro de los que quedan
        auto it = s.find_by_order(pos);
        cout << *it << " ";
        s.erase(it);                     // el siguiente ocupa ahora la posición pos
    }
    cout << "\n";
    return 0;
}
