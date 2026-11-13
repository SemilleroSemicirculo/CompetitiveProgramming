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
 * Algoritmo : LIS con búsqueda binaria
 * Problema  : CSES 1145 - Increasing Subsequence (https://cses.fi/problemset/task/1145)
 * Entrada   : n, luego n enteros
 * Salida    : longitud de la subsecuencia creciente más larga
 * Complejidad: tiempo O(n log n), memoria O(n)
 */

int main(){
    fastio;
    
    ll n; cin >> n;
    vector<ll> a(n); for(auto &x: a) cin >> x;


    // R[k] = menor valor final posible de una LIS de longitud k+1 (siempre ordenado)
    vector<ll> R;
    // M[k] = índice del elemento que está en R[k]
    vector<ll> M;

    for(int i = 0; i < n; ++i) {
        // primer lugar de R con valor >= a[i] (búsqueda binaria)
        auto it = lower_bound(all(R), a[i]);
        ll ind = it - R.begin();

        // a[i] es mayor que todos: la LIS crece
        if (ind == R.size()) {
            R.push_back(a[i]);
            M.push_back(i);
        } 
        else {
            // a[i] reemplaza un final más grande para dejar más espacio a futuro
            R[ind] = a[i];
            M[ind] = i;
        }
    }

    // el tamaño de R es la longitud de la LIS
    cout << R.size() << "\n";
    
}
