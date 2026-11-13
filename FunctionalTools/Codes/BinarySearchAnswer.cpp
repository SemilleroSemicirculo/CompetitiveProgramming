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
 * Algoritmo : Búsqueda binaria sobre la respuesta
 * Problema  : CSES 1620 - Factory Machines (https://cses.fi/problemset/task/1620)
 * Entrada   : n t, luego n tiempos k_i (una máquina produce un producto cada k_i segundos)
 * Salida    : mínimo tiempo para producir t productos
 * Complejidad: tiempo O(n log(t · k_min)), memoria O(n)
 */

int main() {
    fastio;
    int n;
    ll t;
    cin >> n >> t;
    vector<ll> k(n);
    for (auto &x : k) cin >> x;

    // la respuesta es monótona: si en "time" alcanza, en más tiempo también
    // cota superior: la máquina más rápida sola produce t productos en k_min * t
    ll lo = 1, hi = *min_element(all(k)) * t;
    // se busca el menor tiempo que alcanza
    while (lo < hi) {
        ll mid = lo + (hi - lo) / 2;
        ll made = 0;
        for (ll x : k) {
            // cada máquina produce mid / k_i productos
            made += mid / x;
            if (made >= t) break;
        }
        // alcanza: se prueba con menos tiempo; si no, con más
        if (made >= t) hi = mid;
        else lo = mid + 1;
    }
    cout << lo << "\n";
    return 0;
}
