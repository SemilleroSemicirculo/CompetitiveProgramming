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
 * Algoritmo : LIS con DP cuadrática
 * Problema  : CSES 1145 - Increasing Subsequence (https://cses.fi/problemset/task/1145) (da TLE con n = 2·10^5; sirve para n <= 5000)
 * Entrada   : n, luego n enteros
 * Salida    : longitud de la subsecuencia creciente más larga
 * Complejidad: tiempo O(n^2), memoria O(n)
 */

int main(){
    fastio;
    
    ll n; cin >> n;
    vector<ll> a(n); for(auto &x: a) cin >> x;


    vector<ll> DP(n, 1);
    for(int i = 1; i < n; i++){
        for(int j = 0; j < i; j++){
            if(a[j] < a[i]){
                DP[i] = max(DP[i], 1 + DP[j]);
            }
        }
    }

    cout << *max_element(all(DP)) << "\n";
    
    return 0;
}
