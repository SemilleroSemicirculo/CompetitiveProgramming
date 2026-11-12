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
 * Algoritmo : DP sobre subconjuntos (bitmask)
 * Problema  : CSES 1653 - Elevator Rides (https://cses.fi/problemset/task/1653)
 * Entrada   : n x, luego n pesos
 * Salida    : mínimo de viajes del ascensor (capacidad x) para llevar a todos
 * Complejidad: tiempo O(2^n · n), memoria O(2^n)
 */

int main() {
    fastio;
    int n;
    ll x;
    cin >> n >> x;
    vector<ll> w(n);
    for (auto &v : w) cin >> v;

    // dp[mask] = {viajes, peso en el último viaje} mínimo para llevar a las personas de mask
    vector<pair<int, ll>> dp(1 << n, {n + 1, 0});
    dp[0] = {1, 0};
    for (int mask = 1; mask < (1 << n); mask++) {
        for (int i = 0; i < n; i++) {
            if (!(mask >> i & 1)) continue;
            auto [rides, last] = dp[mask ^ (1 << i)];
            if (last + w[i] <= x) last += w[i];
            else rides++, last = w[i];
            dp[mask] = min(dp[mask], {rides, last});
        }
    }
    cout << dp[(1 << n) - 1].first << "\n";
    return 0;
}
