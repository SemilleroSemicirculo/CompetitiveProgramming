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
 * Algoritmo : Combinatoria (estrellas y barras) con factoriales e inversos modulares
 * Problema  : CSES 1716 - Distributing Apples (https://cses.fi/problemset/task/1716)
 * Entrada   : n m (niños y manzanas)
 * Salida    : formas de repartir m manzanas entre n niños, módulo 10^9+7
 * Complejidad: tiempo O(n + m), memoria O(n + m)
 */

const ll M = 1e9 + 7;

ll power(ll b, ll e) { ll r = 1; b %= M; for (; e; e >>= 1, b = b * b % M) if (e & 1) r = r * b % M; return r; }

int main() {
    fastio;
    ll n, m;
    cin >> n >> m;
    // m manzanas (estrellas) y n-1 separadores (barras): se elige dónde van las barras
    // respuesta = C(m + n - 1, n - 1)
    int N = n + m;
    vector<ll> f(N + 1, 1);
    for (int i = 1; i <= N; i++) f[i] = f[i - 1] * i % M;
    // inverso con el pequeño teorema de Fermat: a^(M-2) es el inverso de a módulo primo
    ll k = n - 1;
    cout << f[m + k] * power(f[k], M - 2) % M * power(f[m], M - 2) % M << "\n";
    return 0;
}
