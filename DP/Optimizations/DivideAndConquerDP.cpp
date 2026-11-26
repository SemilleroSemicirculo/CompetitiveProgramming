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
 * Algoritmo : Optimización de DP con divide y vencerás (el corte óptimo es monótono)
 * Problema  : CSES 2086 - Subarray Squares (https://cses.fi/problemset/task/2086)
 * Entrada   : n, k; el arreglo x_1 … x_n
 * Salida    : el mínimo de la suma de los cuadrados de las sumas al partir el arreglo en k tramos
 * Complejidad: tiempo O(k · n log n), memoria O(n)
 */

int n, k;
vector<ll> pre, ant, cur;   // ant = capa j−1, cur = capa j

ll costo(int l, int r) { ll s = pre[r] - pre[l]; return s * s; }   // tramo (l, r]

// calcula cur[i] para i en [lo, hi], sabiendo que su corte óptimo está en [optl, optr]
void resolver(int lo, int hi, int optl, int optr) {
    if (lo > hi) return;
    int mid = (lo + hi) / 2, best = optl;
    cur[mid] = LLONG_MAX;
    for (int p = optl; p <= min(mid - 1, optr); p++) {
        if (ant[p] == LLONG_MAX) continue;
        ll v = ant[p] + costo(p, mid);
        if (v < cur[mid]) cur[mid] = v, best = p;
    }
    // como opt(i) ≤ opt(i + 1), la mitad izquierda corta antes de best y la derecha después
    resolver(lo, mid - 1, optl, best);
    resolver(mid + 1, hi, best, optr);
}

int main() {
    fastio;
    cin >> n >> k;
    pre.assign(n + 1, 0);
    for (int i = 1; i <= n; i++) { ll x; cin >> x; pre[i] = pre[i - 1] + x; }
    ant.assign(n + 1, LLONG_MAX);
    ant[0] = 0;                       // cero tramos cubren el prefijo vacío
    cur.assign(n + 1, LLONG_MAX);
    for (int j = 1; j <= k; j++) {
        fill(all(cur), LLONG_MAX);
        resolver(1, n, 0, n - 1);
        swap(ant, cur);
    }
    cout << ant[n] << "\n";
    return 0;
}
