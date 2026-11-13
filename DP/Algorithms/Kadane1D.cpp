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
 * Algoritmo : Kadane (subarreglo de suma máxima)
 * Problema  : CSES 1643 - Maximum Subarray Sum (https://cses.fi/problemset/task/1643)
 * Entrada   : n, luego n enteros
 * Salida    : máxima suma de un subarreglo no vacío
 * Complejidad: tiempo O(n), memoria O(n)
 */

int main() {
    fastio;
    int n;
    cin >> n;
    vector<ll> a(n);
    for (int i = 0; i < n; i++) {
        cin >> a[i];
    }
    // best = mejor suma encontrada, curr = mejor suma de un subarreglo que termina en i
    ll best = a[0], curr = a[0];
    for (int i = 1; i < n; i++) {
        // o se empieza un subarreglo nuevo en a[i] o se extiende el anterior
        curr = max(a[i], curr + a[i]);
        // se guarda el mejor resultado global
        best = max(best, curr);
    }
    cout << best << "\n";
    return 0;
}
