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
 * Algoritmo : Z-function
 * Problema  : CSES 1753 - String Matching (https://cses.fi/problemset/task/1753)
 * Entrada   : dos líneas: el texto s y el patrón t
 * Salida    : número de apariciones de t en s
 * Complejidad: tiempo O(|s| + |t|), memoria O(|s| + |t|)
 */

// z[i] = longitud del prefijo comun mas largo entre s y s[i..]
vector<int> z_function(const string &s) {
    int n = s.size();
    vector<int> z(n, 0);
    for (int i = 1, l = 0, r = 0; i < n; i++) {
        if (i < r) z[i] = min(r - i, z[i - l]);
        while (i + z[i] < n && s[z[i]] == s[i + z[i]]) z[i]++;
        if (i + z[i] > r) l = i, r = i + z[i];
    }
    return z;
}

int main() {
    fastio;
    string s, t;
    cin >> s >> t;

    // ocurrencias de t en s: z sobre t + '#' + s
    string combined = t + '#' + s;
    vector<int> z = z_function(combined);

    ll count = 0;
    for (int i = t.size() + 1; i < (int)combined.size(); i++)
        if (z[i] == (int)t.size()) count++;

    cout << count << "\n";
    return 0;
}
