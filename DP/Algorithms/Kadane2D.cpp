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
    int R, C;
    cin >> R >> C;
    vector<vector<ll>> mat(R, vector<ll>(C));
    for (int i = 0; i < R; i++)
        for (int j = 0; j < C; j++)
            cin >> mat[i][j];

    ll best = -INF;
    // fijar fila superior y fila inferior
    for (int top = 0; top < R; top++) {
        vector<ll> colSum(C, 0);
        for (int bot = top; bot < R; bot++) {
            for (int j = 0; j < C; j++)
                colSum[j] += mat[bot][j];
            // aplicar Kadane 1D sobre colSum
            ll curr = colSum[0];
            best = max(best, curr);
            for (int j = 1; j < C; j++) {
                curr = max(colSum[j], curr + colSum[j]);
                best = max(best, curr);
            }
        }
    }
    cout << best << "\n";
    return 0;
}
