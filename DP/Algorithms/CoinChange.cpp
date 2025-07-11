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

int main() {
    fastio;
    int n, target;
    cin >> n >> target;
    vector<int> coins(n);
    for (int i = 0; i < n; i++) cin >> coins[i];

    // dp[x] = mínimo número de monedas para sumar x
    vector<int> dp(target+1, INT_MAX);
    dp[0] = 0;
    for (int c : coins) {
        for (int x = c; x <= target; x++) {
            if (dp[x-c] != INT_MAX)
                dp[x] = min(dp[x], dp[x-c] + 1);
        }
    }

    int ans = dp[target];
    cout << (ans == INT_MAX ? -1 : ans) << "\n";
    return 0;
}
