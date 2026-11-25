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
 * Algoritmo : Búsqueda binaria sobre la respuesta + verificación golosa
 * Problema  : CSES 1085 - Array Division (https://cses.fi/problemset/task/1085)
 * Entrada   : n k, luego n enteros positivos
 * Salida    : la menor suma máxima posible al partir el arreglo en k subarreglos
 * Complejidad: tiempo O(n log S) con S = suma total, memoria O(n)
 */

int main() {
    fastio;
    int n, k;
    cin >> n >> k;
    vector<ll> x(n);
    ll lo = 0, hi = 0;
    for (auto &v : x) cin >> v, lo = max(lo, v), hi += v;
    // ¿se puede con suma máxima L? Golosamente se llena cada parte hasta donde quepa
    auto cabe = [&](ll L) {
        int partes = 1;
        ll s = 0;
        for (ll v : x) {
            if (s + v > L) partes++, s = 0;
            s += v;
        }
        return partes <= k;
    };
    // si L sirve, cualquier L mayor también: se busca el menor que sirve
    while (lo < hi) {
        ll mid = (lo + hi) / 2;
        if (cabe(mid)) hi = mid;
        else lo = mid + 1;
    }
    cout << lo << "\n";
    return 0;
}
