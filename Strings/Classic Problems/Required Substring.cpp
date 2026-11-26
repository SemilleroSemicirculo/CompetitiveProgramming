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
 * Algoritmo : DP sobre el autómata de KMP (contar cadenas que contienen un patrón)
 * Problema  : CSES 1112 - Required Substring (https://cses.fi/problemset/task/1112)
 * Entrada   : n, luego un patrón de largo m (letras A–Z)
 * Salida    : cantidad de cadenas de largo n que contienen el patrón, módulo 10^9+7
 * Complejidad: tiempo O(n · m · 26), memoria O(m · 26)
 */

const ll M = 1e9 + 7;

int main() {
    fastio;
    int n;
    string p;
    cin >> n >> p;
    int m = p.size();
    // función de prefijos del patrón
    vector<int> lps(m, 0);
    for (int i = 1; i < m; i++) {
        int j = lps[i - 1];
        while (j > 0 && p[i] != p[j]) j = lps[j - 1];
        if (p[i] == p[j]) j++;
        lps[i] = j;
    }
    // go[k][c] = cuántos caracteres del patrón llevo emparejados si tenía k y leo c
    vector<array<int, 26>> go(m);
    for (int k = 0; k < m; k++)
        for (int c = 0; c < 26; c++) {
            if (p[k] - 'A' == c) go[k][c] = k + 1;
            else go[k][c] = k ? go[lps[k - 1]][c] : 0;
        }
    // dp[k] = cadenas del largo actual que todavía NO contienen el patrón y tienen k emparejados
    vector<ll> dp(m, 0), nd(m);
    dp[0] = 1;
    ll total = 1;  // 26^largo
    for (int len = 0; len < n; len++) {
        fill(all(nd), 0);
        for (int k = 0; k < m; k++) if (dp[k])
            for (int c = 0; c < 26; c++) {
                int t = go[k][c];
                if (t < m) nd[t] = (nd[t] + dp[k]) % M;  // si t == m ya apareció: se descarta
            }
        dp = nd;
        total = total * 26 % M;
    }
    // las que contienen el patrón = todas - las que nunca lo completaron
    ll malas = 0;
    for (ll x : dp) malas = (malas + x) % M;
    cout << (total - malas + M) % M << "\n";
    return 0;
}
