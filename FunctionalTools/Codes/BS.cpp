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
 * Algoritmo : Búsqueda binaria manual
 * Problema  : Sin problema equivalente en CSES; formato propio
 * Entrada   : n target, luego n enteros ordenados
 * Salida    : FOUND at index i, o NOT FOUND
 * Complejidad: tiempo O(log n), memoria O(n)
 */

// devuelve el índice de target en a[] o -1 si no existe
int binary_search_manual(const vector<ll>& a, ll target) {
    int lo = 0, hi = int(a.size()) - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] == target) return mid;
        if (a[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}

int main() {
    fastio;
    int n; ll target;
    cin >> n >> target;
    vector<ll> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];
    // asume a[] ordenado
    int idx = binary_search_manual(a, target);
    if (idx != -1) cout << "FOUND at index " << idx << "\n";
    else cout << "NOT FOUND\n";
    return 0;
}
