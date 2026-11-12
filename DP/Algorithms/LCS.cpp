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
 * Algoritmo : Subsecuencia común más larga (LCS) con reconstrucción
 * Problema  : CSES 3403 - Longest Common Subsequence (https://cses.fi/problemset/task/3403)
 * Entrada   : n m, luego los n enteros de a y los m enteros de b
 * Salida    : longitud de la LCS y una LCS
 * Complejidad: tiempo O(n·m), memoria O(n·m)
 */

int main() {
    fastio;
    int n, m;
    cin >> n >> m;
    vector<int> a(n), b(m);
    for (auto &x : a) cin >> x;
    for (auto &x : b) cin >> x;

    // LCS[i][j] = longitud de la LCS de a[0..i) y b[0..j)
    vector<vector<int>> LCS(n + 1, vector<int>(m + 1, 0));
    for (int i = 1; i <= n; ++i)
        for (int j = 1; j <= m; ++j)
            if (a[i - 1] == b[j - 1])
                LCS[i][j] = LCS[i - 1][j - 1] + 1;
            else
                LCS[i][j] = max(LCS[i - 1][j], LCS[i][j - 1]);

    // reconstrucción desde el final
    vector<int> res;
    int i = n, j = m;
    while (i > 0 && j > 0) {
        if (a[i - 1] == b[j - 1]) {
            res.push_back(a[i - 1]);
            i--, j--;
        }
        else if (LCS[i - 1][j] >= LCS[i][j - 1]) i--;
        else j--;
    }
    reverse(all(res));

    cout << LCS[n][m] << "\n";
    for (int x : res) cout << x << ' ';
    cout << "\n";
    return 0;
}
