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
 * Algoritmo : Suffix Array + LCP (mayor subcadena que se repite)
 * Problema  : CSES 2106 - Repeating Substring (https://cses.fi/problemset/task/2106)
 * Entrada   : una cadena de largo n
 * Salida    : la subcadena más larga que aparece al menos dos veces, o -1
 * Complejidad: tiempo O(n log n), memoria O(n)
 */

int main() {
    fastio;
    string s;
    cin >> s;
    s += '$';  // centinela menor que todas las letras
    int n = s.size();
    // suffix array por duplicación: se ordenan los sufijos por sus primeros 2^k caracteres
    vector<int> sa(n), rk(n), tmp(n);
    for (int i = 0; i < n; i++) sa[i] = i, rk[i] = s[i];
    for (int k = 1;; k <<= 1) {
        auto cmp = [&](int a, int b) {
            if (rk[a] != rk[b]) return rk[a] < rk[b];
            return rk[(a + k) % n] < rk[(b + k) % n];
        };
        sort(all(sa), cmp);
        tmp[sa[0]] = 0;
        for (int i = 1; i < n; i++) tmp[sa[i]] = tmp[sa[i - 1]] + cmp(sa[i - 1], sa[i]);
        rk = tmp;
        if (rk[sa[n - 1]] == n - 1) break;
    }
    // LCP con Kasai: lcp[i] = prefijo común entre los sufijos sa[i] y sa[i-1]
    // la subcadena repetida más larga es el mayor LCP entre sufijos vecinos
    int best = 0, where = 0;
    for (int i = 0, h = 0; i < n; i++) {
        if (rk[i] == 0) { h = 0; continue; }
        int j = sa[rk[i] - 1];
        while (s[i + h] == s[j + h]) h++;
        if (h > best) best = h, where = i;
        if (h > 0) h--;
    }
    if (best == 0) cout << -1 << "\n";
    else cout << s.substr(where, best) << "\n";
    return 0;
}
