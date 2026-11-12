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
 * Algoritmo : KMP con prefix-function sobre patrón + '#' + texto
 * Problema  : CSES 1753 - String Matching (https://cses.fi/problemset/task/1753)
 * Entrada   : texto s y luego patrón t
 * Salida    : cantidad de apariciones de t en s
 * Complejidad: tiempo O(|s| + |t|), memoria O(|s| + |t|)
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

// posiciones (base 0) de t dentro de s
vector<int> PatternSearch(const string &s, const string &t) {
    vector<int> pos;
    string combined = t + '#' + s;
    vector<int> lps = KMP(combined);
    for (int i = t.size() + 1; i < (int)lps.size(); i++)
        if (lps[i] == (int)t.size())
            pos.push_back(i - 2 * t.size());
    return pos;
}

int main() {
    fastio;
    string s, t;
    cin >> s >> t;
    cout << PatternSearch(s, t).size() << "\n";
    return 0;
}
