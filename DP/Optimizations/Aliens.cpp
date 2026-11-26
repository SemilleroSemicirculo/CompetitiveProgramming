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
 * Algoritmo : Truco de Aliens / relajación lagrangiana (quitar la restricción "a lo sumo k" con una penalización λ)
 * Problema  : problema propio (k subarreglos disjuntos de suma máxima)
 * Entrada   : n k; a_1 … a_n (|a_i| ≤ 10^9)
 * Salida    : la suma máxima de a lo sumo k subarreglos no vacíos y disjuntos (0 si conviene no tomar ninguno)
 * Complejidad: tiempo O(n log V) (V = rango de λ), memoria O(n)
 */

// f(j) = mejor suma con exactamente j subarreglos es cóncava en j. En vez de una DP O(n·k) se cobra λ por
// cada subarreglo y se resuelve sin límite: g(λ) = max_j f(j) − λ·j, una DP O(n) que además devuelve el j
// usado. Al subir λ el j óptimo baja; con el menor λ ≥ 0 que da j ≤ k, la respuesta es g(λ) + λ·k.
int n;
vector<ll> a;
pair<ll, int> resolver(ll lam) {   // (mejor valor penalizado, menor cantidad de subarreglos que lo logra)
    // fuera: no estoy dentro de un subarreglo; dentro: el último elemento pertenece a uno abierto
    pair<ll, int> fuera = {0, 0}, dentro = {LLONG_MIN / 4, 0};
    auto mejor = [](pair<ll, int> x, pair<ll, int> y) {   // más valor; a igual valor, menos subarreglos
        if (x.first != y.first) return x.first > y.first ? x : y;
        return x.second < y.second ? x : y;
    };
    for (int i = 0; i < n; i++) {
        pair<ll, int> abrir = {fuera.first - lam + a[i], fuera.second + 1};
        pair<ll, int> seguir = {dentro.first + a[i], dentro.second};
        pair<ll, int> nd = mejor(abrir, seguir);
        fuera = mejor(fuera, dentro);
        dentro = nd;
    }
    return mejor(fuera, dentro);
}

int main() {
    fastio;
    int k;
    cin >> n >> k;
    a.resize(n);
    for (auto &x : a) cin >> x;
    ll lo = 0, hi = 3e14;   // con λ más grande que cualquier ganancia, no se toma ningún subarreglo
    while (lo < hi) {
        ll mid = (lo + hi) / 2;
        if (resolver(mid).second <= k) hi = mid; else lo = mid + 1;
    }
    cout << resolver(lo).first + lo * k << "\n";
    return 0;
}
