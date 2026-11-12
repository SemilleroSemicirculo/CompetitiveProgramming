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
 * Algoritmo : Manacher (subcadena palíndroma más larga)
 * Problema  : CSES 1111 - Longest Palindrome (https://cses.fi/problemset/task/1111)
 * Entrada   : una cadena s
 * Salida    : la subcadena palíndroma más larga
 * Complejidad: tiempo O(n), memoria O(n)
 */

// d1[i] = radio de palíndromos impares centrados en i, d2[i] = radio de los pares
string longestPalindrome(const string &s) {
    int n = s.size();
    vector<int> d1(n), d2(n);
    for (int i = 0, l = 0, r = -1; i < n; i++) {
        int k = (i > r) ? 1 : min(d1[l + r - i], r - i + 1);
        while (i - k >= 0 && i + k < n && s[i - k] == s[i + k]) k++;
        d1[i] = k--;
        if (i + k > r) l = i - k, r = i + k;
    }
    for (int i = 0, l = 0, r = -1; i < n; i++) {
        int k = (i > r) ? 0 : min(d2[l + r - i + 1], r - i + 1);
        while (i - k - 1 >= 0 && i + k < n && s[i - k - 1] == s[i + k]) k++;
        d2[i] = k--;
        if (i + k > r) l = i - k - 1, r = i + k;
    }

    int best = 0, start = 0;
    for (int i = 0; i < n; i++) {
        if (2 * d1[i] - 1 > best) best = 2 * d1[i] - 1, start = i - d1[i] + 1;
        if (2 * d2[i] > best) best = 2 * d2[i], start = i - d2[i];
    }
    return s.substr(start, best);
}

int main() {
    fastio;
    string s;
    cin >> s;
    cout << longestPalindrome(s) << "\n";
    return 0;
}
