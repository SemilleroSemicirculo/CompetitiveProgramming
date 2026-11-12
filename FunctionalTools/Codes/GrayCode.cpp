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
 * Algoritmo : Código de Gray (i ^ (i >> 1))
 * Problema  : CSES 2205 - Gray Code (https://cses.fi/problemset/task/2205)
 * Entrada   : n
 * Salida    : los 2^n códigos de Gray de n bits, uno por línea
 * Complejidad: tiempo O(2^n · n), memoria O(n)
 */

int main(){
    fastio;
 
    ll n; cin >> n;
    for(int i = 0; i < (1<<n); ++i){
        ll gn = (i^(i >> 1));
        string res = "";
        for(int i = 0; i < n; i++){
            if(gn & (1 << i)) res += "1";
            else res += "0";
        }
        reverse(all(res));
        cout << res  << "\n";
    }
}
