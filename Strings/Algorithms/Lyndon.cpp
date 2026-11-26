#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef long double ld;
const ll INF = numeric_limits<ll>::max() / 4;   // deja margen para INF + w sin desbordar

#define all(x) x.begin(), x.end()
#define rall(x) x.rbegin(), x.rend()
#define MOD 998244353
#define pi acos(-1)
#define gcd __gcd
inline ll lcm(ll a, ll b) { return a / __gcd(a, b) * b; }   // divide antes de multiplicar
#define precision(n) cout << fixed << setprecision(n)
#define debug(arr) do { cerr << #arr << " = "; for (auto &x : arr) cerr << x << " "; cerr << endl; } while (0)
#define fastio ios::sync_with_stdio(0); cin.tie(0); cout.tie(0);
/*
 * Algoritmo : Factorización de Lyndon (algoritmo de Duval)
 * Problema  : Library Checker - Lyndon Factorization (https://judge.yosupo.jp/problem/lyndon_factorization)
 * Entrada   : una cadena S de minúsculas
 * Salida    : 0 = a_0 < a_1 < … < a_k = |S| tales que S[a_i, a_{i+1}) son palabras de Lyndon no crecientes
 * Complejidad: tiempo O(|S|), memoria O(1) extra
 */

// Una palabra de Lyndon es estrictamente menor que todas sus rotaciones. Toda cadena se parte de forma
// única en palabras de Lyndon w_1 ≥ w_2 ≥ … . Duval avanza con dos punteros: i marca el inicio del
// bloque y j compara contra el período actual (k).
vector<int> duval(const string &s) {
    int n = s.size(), i = 0;
    vector<int> cortes = {0};
    while (i < n) {
        int j = i + 1, k = i;
        while (j < n && s[k] <= s[j]) {
            if (s[k] < s[j]) k = i;   // la palabra de Lyndon se alarga hasta j
            else k++;                 // se repite el período
            j++;
        }
        while (i <= k) { i += j - k; cortes.push_back(i); }   // emitir las copias completas del período
    }
    return cortes;
}

int main() {
    fastio;
    string s;
    cin >> s;
    vector<int> c = duval(s);
    for (int i = 0; i < (int)c.size(); i++) cout << c[i] << " \n"[i + 1 == (int)c.size()];
    return 0;
}
