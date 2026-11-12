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
 * Algoritmo : Búsqueda ternaria (máximo de una función unimodal)
 * Problema  : Sin problema equivalente en CSES; formato propio
 * Entrada   : L R
 * Salida    : el máximo de f(x) = -(x-3)^2 + 10 en [L, R]
 * Complejidad: tiempo O(log(R-L)), memoria O(1)
 */

// asume f es unimodal (primero crece luego decrece) en [l..r]
ll ternary_search(int l, int r, function<ll(int)> f) {
    while (r - l > 3) {
        int m1 = l + (r - l) / 3;
        int m2 = r - (r - l) / 3;
        if (f(m1) < f(m2))
            l = m1;
        else
            r = m2;
    }
    ll best = f(l);
    for (int i = l+1; i <= r; i++)
        best = max(best, f(i));
    return best;
}

int main() {
    fastio;
    int L, R;
    cin >> L >> R;
    // ejemplo: f(x) = -(x-3)^2 + 10  (unimodal)
    auto f = [&](int x){ return -(ll)(x-3)*(x-3) + 10; };
    ll ans = ternary_search(L, R, f);
    cout << ans << "\n";
    return 0;
}
