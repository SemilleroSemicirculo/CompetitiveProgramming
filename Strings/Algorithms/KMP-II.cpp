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
 * Algoritmo : KMP con prefix-function solo del patrón
 * Problema  : CSES 1753 - String Matching (https://cses.fi/problemset/task/1753)
 * Entrada   : texto s y luego patrón t
 * Salida    : cantidad de apariciones de t en s
 * Complejidad: tiempo O(|s| + |t|), memoria O(|t|)
 */

vector<int> KMP(const string &s) {
    vector<int> LP(s.size(), 0);
    for (int i = 1; i < (int)s.size(); i++) {
        int j = LP[i - 1];
        while (j > 0 && s[i] != s[j]) j = LP[j - 1];
        if (s[i] == s[j]) j++;
        LP[i] = j;
    }
    return LP;
}

// posiciones (base 0) de pattern dentro de text
vector<int> PatternSearch(const string &text, const string &pattern) {
    vector<int> lp = KMP(pattern);
    vector<int> result;
    int j = 0;
    for (int i = 0; i < (int)text.size(); i++) {
        while (j > 0 && text[i] != pattern[j]) j = lp[j - 1];
        if (text[i] == pattern[j]) j++;
        if (j == (int)pattern.size()) {
            result.push_back(i - pattern.size() + 1);
            j = lp[j - 1];
        }
    }
    return result;
}

int main() {
    fastio;
    string s, t;
    cin >> s >> t;
    cout << PatternSearch(s, t).size() << "\n";
    return 0;
}
