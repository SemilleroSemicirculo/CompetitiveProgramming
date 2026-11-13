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
 * Algoritmo : Meet in the middle (subconjuntos con suma x)
 * Problema  : CSES 1628 - Meet in the Middle (https://cses.fi/problemset/task/1628)
 * Entrada   : n x, luego n enteros
 * Salida    : cantidad de subconjuntos cuya suma es x
 * Complejidad: tiempo O(2^(n/2) · n), memoria O(2^(n/2))
 */

// todas las sumas de subconjuntos de a[l..r)
// genera 2^(r-l) sumas duplicando la lista con cada elemento
vector<ll> subsetSums(const vector<ll> &a, int l, int r) {
    vector<ll> sums = {0};
    for (int i = l; i < r; i++) {
        int sz = sums.size();
        for (int j = 0; j < sz; j++) sums.push_back(sums[j] + a[i]);
    }
    return sums;
}

int main() {
    fastio;
    int n;
    ll x;
    cin >> n >> x;
    vector<ll> a(n);
    for (auto &v : a) cin >> v;

    // se divide el arreglo en dos mitades
    vector<ll> L = subsetSums(a, 0, n / 2), R = subsetSums(a, n / 2, n);
    // R ordenado para buscar con búsqueda binaria
    sort(all(R));
    ll count = 0;
    for (ll s : L)
        // para cada suma de la mitad izquierda se cuentan las de la derecha que completan x
        count += upper_bound(all(R), x - s) - lower_bound(all(R), x - s);
    cout << count << "\n";
    return 0;
}
