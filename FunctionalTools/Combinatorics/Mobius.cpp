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
 * Algoritmo : Función de Möbius e inversión (inclusión-exclusión sobre divisores)
 * Problema  : CSES 2417 - Counting Coprime Pairs (https://cses.fi/problemset/task/2417)
 * Entrada   : n; luego n enteros x_i (1 ≤ x_i ≤ 10^6)
 * Salida    : cuántos pares i < j cumplen gcd(x_i, x_j) = 1
 * Complejidad: tiempo O(V log V) con V = 10^6, memoria O(V)
 */

const int V = 1000000;

int main() {
    fastio;
    int n;
    cin >> n;
    vector<int> cnt(V + 1, 0);
    for (int i = 0; i < n; i++) { int x; cin >> x; cnt[x]++; }
    // μ(1) = 1, μ(d) = (−1)^k si d es producto de k primos distintos, 0 si tiene un cuadrado
    vector<int> mu(V + 1, 1), primo(V + 1, 1);
    for (int p = 2; p <= V; p++) if (primo[p]) {
        for (int j = p; j <= V; j += p) { if (j > p) primo[j] = 0; mu[j] = -mu[j]; }
        for (ll j = (ll)p * p; j <= V; j += (ll)p * p) mu[j] = 0;
    }
    // pares coprimos = Σ_d μ(d) · C(m_d, 2), con m_d = cuántos números son múltiplos de d:
    // es inclusión-exclusión sobre "d divide a los dos"
    ll res = 0;
    for (int d = 1; d <= V; d++) {
        if (!mu[d]) continue;
        ll m = 0;
        for (int j = d; j <= V; j += d) m += cnt[j];
        res += mu[d] * m * (m - 1) / 2;
    }
    cout << res << "\n";
    return 0;
}
