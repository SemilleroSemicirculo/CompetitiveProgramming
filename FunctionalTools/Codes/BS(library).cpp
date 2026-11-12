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
 * Algoritmo : Búsqueda binaria con la librería (binary_search / lower_bound)
 * Problema  : Sin problema equivalente en CSES; formato propio
 * Entrada   : n target, luego n enteros ordenados
 * Salida    : FOUND y su índice, o NOT FOUND
 * Complejidad: tiempo O(log n), memoria O(n)
 */

int main() {
    fastio;
    int n; ll target;
    cin >> n >> target;
    vector<ll> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];
    // asume a[] ordenado
    bool found = binary_search(all(a), target);
    if (found) {
        cout << "FOUND\n";
        // posición con lower_bound:
        int idx = int(lower_bound(all(a), target) - a.begin());
        cout << "at index " << idx << "\n";
    } else {
        cout << "NOT FOUND\n";
    }
    return 0;
}
