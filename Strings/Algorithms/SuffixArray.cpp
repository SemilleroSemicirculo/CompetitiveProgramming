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
 * Algoritmo : Suffix Array (duplicación de prefijos) + LCP de Kasai
 * Problema  : CSES 2105 - Distinct Substrings (https://cses.fi/problemset/task/2105)
 * Entrada   : una cadena s
 * Salida    : cantidad de subcadenas distintas de s
 * Complejidad: tiempo O(n log^2 n), memoria O(n)
 */

vector<int> suffixArray(const string &s) {
    int n = s.size();
    vector<int> sa(n), rnk(n), tmp(n);
    iota(all(sa), 0);
    for (int i = 0; i < n; i++) rnk[i] = s[i];
    for (int k = 1;; k <<= 1) {
        auto cmp = [&](int a, int b) {
            if (rnk[a] != rnk[b]) return rnk[a] < rnk[b];
            int ra = a + k < n ? rnk[a + k] : -1;
            int rb = b + k < n ? rnk[b + k] : -1;
            return ra < rb;
        };
        sort(all(sa), cmp);
        tmp[sa[0]] = 0;
        for (int i = 1; i < n; i++) tmp[sa[i]] = tmp[sa[i - 1]] + cmp(sa[i - 1], sa[i]);
        rnk = tmp;
        if (rnk[sa[n - 1]] == n - 1) break;
    }
    return sa;
}

// lcp[i] = prefijo común entre sa[i] y sa[i + 1]
vector<int> kasai(const string &s, const vector<int> &sa) {
    int n = s.size();
    vector<int> rnk(n), lcp(max(0, n - 1));
    for (int i = 0; i < n; i++) rnk[sa[i]] = i;
    for (int i = 0, h = 0; i < n; i++) {
        if (rnk[i] + 1 < n) {
            int j = sa[rnk[i] + 1];
            while (i + h < n && j + h < n && s[i + h] == s[j + h]) h++;
            lcp[rnk[i]] = h;
            if (h > 0) h--;
        }
        else h = 0;
    }
    return lcp;
}

int main() {
    fastio;
    string s;
    cin >> s;
    ll n = s.size();
    auto sa = suffixArray(s);
    auto lcp = kasai(s, sa);

    // subcadenas distintas = todas las subcadenas - prefijos repetidos
    ll total = n * (n + 1) / 2;
    for (int x : lcp) total -= x;
    cout << total << "\n";
    return 0;
}
