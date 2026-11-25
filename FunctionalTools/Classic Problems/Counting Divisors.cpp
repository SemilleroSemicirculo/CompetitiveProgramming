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
 * Algoritmo : Criba del menor factor primo + fórmula de cantidad de divisores
 * Problema  : CSES 1713 - Counting Divisors (https://cses.fi/problemset/task/1713)
 * Entrada   : n, luego n enteros x (x ≤ 10^6)
 * Salida    : la cantidad de divisores de cada x
 * Complejidad: tiempo O(X log log X + n log x), memoria O(X)
 */

const int X = 1000000;

int main() {
    fastio;
    // spf[v] = menor factor primo de v
    vector<int> spf(X + 1, 0);
    for (int i = 2; i <= X; i++)
        if (!spf[i])
            for (int j = i; j <= X; j += i)
                if (!spf[j]) spf[j] = i;
    int n;
    cin >> n;
    while (n--) {
        int x;
        cin >> x;
        // si x = p1^e1 · p2^e2 · ..., tiene (e1 + 1)(e2 + 1)... divisores
        int res = 1;
        while (x > 1) {
            int p = spf[x], e = 0;
            while (x % p == 0) x /= p, e++;
            res *= e + 1;
        }
        cout << res << "\n";
    }
    return 0;
}
