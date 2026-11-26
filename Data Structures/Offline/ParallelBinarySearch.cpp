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
 * Algoritmo : Búsqueda binaria paralela (todas las búsquedas avanzan juntas sobre la misma simulación)
 * Problema  : SPOJ METEORS - Meteors (https://www.spoj.com/problems/METEORS/)
 * Entrada   : N M; dueño o_1 … o_M de cada sector (en círculo); metas p_1 … p_N; K; K lluvias "l r a"
 *             (los sectores de l a r, dando la vuelta si l > r, reciben a cada uno)
 * Salida    : para cada estado, la primera lluvia tras la cual junta al menos p_i, o NIE
 * Complejidad: tiempo O((M + K) log M log K), memoria O(N + M + K)
 */

int M;
vector<ll> bit;
void add(int i, ll v) { for (; i <= M; i += i & -i) bit[i] += v; }
ll qry(int i) { ll s = 0; for (; i > 0; i -= i & -i) s += bit[i]; return s; }
void lluvia(int l, int r, ll a) {   // suma a en el rango (circular) con diferencias
    if (l <= r) { add(l, a); add(r + 1, -a); }
    else { add(l, a); add(1, a); add(r + 1, -a); }
}

int main() {
    fastio;
    int N;
    cin >> N >> M;
    vector<vector<int>> sect(N + 1);
    for (int i = 1; i <= M; i++) { int o; cin >> o; sect[o].push_back(i); }
    vector<ll> meta(N + 1);
    for (int i = 1; i <= N; i++) cin >> meta[i];
    int K;
    cin >> K;
    vector<int> L(K + 1), R(K + 1);
    vector<ll> A(K + 1);
    for (int i = 1; i <= K; i++) cin >> L[i] >> R[i] >> A[i];
    // cada estado busca en [lo, hi] la primera lluvia suficiente (K + 1 = nunca)
    vector<int> lo(N + 1, 1), hi(N + 1, K + 1);
    bool cambio = true;
    while (cambio) {
        cambio = false;
        // agrupar los estados por su punto medio actual y barrer las lluvias una sola vez
        vector<vector<int>> en(K + 2);
        for (int s = 1; s <= N; s++) if (lo[s] < hi[s]) { en[(lo[s] + hi[s]) / 2].push_back(s); cambio = true; }
        if (!cambio) break;
        bit.assign(M + 2, 0);
        for (int t = 1; t <= K; t++) {
            lluvia(L[t], R[t], A[t]);
            for (int s : en[t]) {
                ll total = 0;
                for (int x : sect[s]) { total += qry(x); if (total >= meta[s]) break; }   // evitar desbordes
                if (total >= meta[s]) hi[s] = t; else lo[s] = t + 1;
            }
        }
    }
    for (int s = 1; s <= N; s++) {
        if (lo[s] > K) cout << "NIE\n"; else cout << lo[s] << "\n";
    }
    return 0;
}
