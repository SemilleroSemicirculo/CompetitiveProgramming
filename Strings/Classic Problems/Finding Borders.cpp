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
 * Algoritmo : Función de prefijos (KMP) y cadena de bordes
 * Problema  : CSES 1732 - Finding Borders (https://cses.fi/problemset/task/1732)
 * Entrada   : una cadena de largo n
 * Salida    : todos los largos de bordes (prefijo que también es sufijo, sin ser toda la cadena) en orden creciente
 * Complejidad: tiempo O(n), memoria O(n)
 */

int main() {
    fastio;
    string s;
    cin >> s;
    int n = s.size();
    // lps[i] = largo del mayor borde de s[0..i]
    vector<int> lps(n, 0);
    for (int i = 1; i < n; i++) {
        int j = lps[i - 1];
        while (j > 0 && s[i] != s[j]) j = lps[j - 1];
        if (s[i] == s[j]) j++;
        lps[i] = j;
    }
    // los bordes de s son: el mayor (lps[n-1]), el mayor borde de ese borde, y así sucesivamente
    vector<int> res;
    for (int b = lps[n - 1]; b > 0; b = lps[b - 1]) res.push_back(b);
    reverse(all(res));
    for (int b : res) cout << b << ' ';
    cout << "\n";
    return 0;
}
