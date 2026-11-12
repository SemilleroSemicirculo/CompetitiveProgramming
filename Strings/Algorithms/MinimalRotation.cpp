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
 * Algoritmo : Rotación lexicográficamente mínima (algoritmo de Booth/Duval)
 * Problema  : CSES 1110 - Minimal Rotation (https://cses.fi/problemset/task/1110)
 * Entrada   : una cadena s
 * Salida    : la rotación lexicográficamente mínima de s
 * Complejidad: tiempo O(n), memoria O(n)
 */

// índice de inicio de la rotación mínima
int minimalRotation(const string &s) {
    string t = s + s;
    int n = s.size(), i = 0, j = 1, k = 0;
    while (i < n && j < n && k < n) {
        char a = t[i + k], b = t[j + k];
        if (a == b) { k++; continue; }
        if (a > b) i += k + 1;
        else j += k + 1;
        if (i == j) j++;
        k = 0;
    }
    return min(i, j);
}

int main() {
    fastio;
    string s;
    cin >> s;
    int p = minimalRotation(s);
    cout << s.substr(p) + s.substr(0, p) << "\n";
    return 0;
}
