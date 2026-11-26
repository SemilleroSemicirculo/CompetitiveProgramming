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
 * Algoritmo : Slope trick (la DP es una función convexa por tramos; se guardan solo sus puntos de quiebre en un heap)
 * Problema  : Codeforces 713C - Sonya and Problem Wihtout a Legend (https://codeforces.com/problemset/problem/713/C)
 * Entrada   : n; a_1 … a_n
 * Salida    : el mínimo de operaciones ±1 para que el arreglo quede estrictamente creciente
 * Complejidad: tiempo O(n log n), memoria O(n)
 */

// Restar i a a_i convierte "estrictamente creciente" en "no decreciente". dp_i(x) = costo mínimo con b_i = x
// es convexa: dp_i(x) = min_{y ≤ x} dp_{i−1}(y) + |x − a_i|. Un max-heap guarda los quiebres de la parte con
// pendiente negativa; si a_i queda por debajo del mayor quiebre, se paga la diferencia y ese quiebre baja a a_i.
int main() {
    fastio;
    int n;
    cin >> n;
    priority_queue<ll> pq;
    ll ans = 0;
    for (int i = 0; i < n; i++) {
        ll x;
        cin >> x;
        x -= i;
        pq.push(x);
        if (pq.top() > x) {
            ans += pq.top() - x;
            pq.pop();
            pq.push(x);
        }
    }
    cout << ans << "\n";
    return 0;
}
