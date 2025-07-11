#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef long double ld;
const ll INF = numeric_limits<ll>::max();

#define all(x) x.begin(), x.end()
#define rall(x) x.rbegin(), x.rend()
#define MOD 998244353
// #define MOD pow(10, 9)+7;
// #define MOD 3245284303;
#define pi acos(-1)
#define gcd __gcd
#define lcm(a, b) ((a) * (b) / gcd(a, b))
#define precision(n) cout << fixed << setprecision(n)
#define debug(arr) cerr << #arr << " = "; for (auto &x : arr) cerr << x << " "; cerr << endl;
#define fastio ios::sync_with_stdio(0); cin.tie(0); cout.tie(0);


string s, t;
vector<vector<int>> LCS;

string reconstruct(int i, int j) {
    if (i == 0 || j == 0) return "";
    if (s[i - 1] == t[j - 1])
        return reconstruct(i - 1, j - 1) + s[i - 1];
    if (LCS[i - 1][j] > LCS[i][j - 1])
        return reconstruct(i - 1, j);
    return reconstruct(i, j - 1);
}

int main() {
    cin >> s >> t;
    ll n = s.size(), m = t.size();
    LCS.assign(n + 1, vector<int>(m + 1, 0));

    for (int i = 1; i <= n; ++i)
        for (int j = 1; j <= m; ++j)
            if (s[i - 1] == t[j - 1])
                LCS[i][j] = LCS[i - 1][j - 1] + 1;
            else
                LCS[i][j] = max(LCS[i - 1][j], LCS[i][j - 1]);

    cout << LCS[n][m] << '\n';
    cout << reconstruct(n, m) << '\n';

    return 0;
}