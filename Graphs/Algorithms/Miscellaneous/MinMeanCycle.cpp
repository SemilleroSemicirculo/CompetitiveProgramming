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
 * Algoritmo : Ciclo de media mínima (algoritmo de Karp)
 * Problema  : UVa 11090 - Going in Cycle!! (https://onlinejudge.org/external/110/11090.pdf)
 * Entrada   : T; cada caso: n m y m arcos dirigidos "a b c" (1-indexados)
 * Salida    : "Case #i: X" con la menor media de peso de un ciclo (2 decimales) o "Case #i: No cycle found."
 * Complejidad: tiempo O(n · m), memoria O(n²)
 */

// D[k][v] = menor peso de un camino de exactamente k arcos que termina en v (empezando en cualquier lado).
// Karp: media mínima = min_v max_k (D[n][v] − D[k][v]) / (n − k), sobre los D finitos.
int main() {
    fastio;
    int T;
    cin >> T;
    for (int cs = 1; cs <= T; cs++) {
        int n, m;
        cin >> n >> m;
        vector<array<ll, 3>> e(m);
        for (auto &x : e) { cin >> x[0] >> x[1] >> x[2]; x[0]--; x[1]--; }
        vector<vector<ll>> D(n + 1, vector<ll>(n, INF));
        fill(all(D[0]), 0);
        for (int k = 1; k <= n; k++)
            for (auto &[a, b, c] : e) if (D[k - 1][a] < INF) D[k][b] = min(D[k][b], D[k - 1][a] + c);
        bool hay = false;
        ll bn = 0, bd = 1;   // mejor media como fracción bn / bd (comparación exacta)
        for (int v = 0; v < n; v++) {
            if (D[n][v] >= INF) continue;
            ll wn = 0, wd = 0;   // el máximo sobre k para este v
            for (int k = 0; k < n; k++) {
                if (D[k][v] >= INF) continue;
                ll num = D[n][v] - D[k][v], den = n - k;
                if (wd == 0 || num * wd > wn * den) wn = num, wd = den;
            }
            if (!hay || wn * bd < bn * wd) bn = wn, bd = wd, hay = true;
        }
        cout << "Case #" << cs << ": ";
        if (!hay) cout << "No cycle found.\n";
        else cout << fixed << setprecision(2) << (double)bn / bd << "\n";
    }
    return 0;
}
