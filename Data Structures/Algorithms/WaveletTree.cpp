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
 * Algoritmo : Wavelet tree (k-ésimo menor y conteo de valores en un rango)
 * Problema  : Library Checker - Range Kth Smallest (https://judge.yosupo.jp/problem/range_kth_smallest)
 * Entrada   : N Q; a_0 … a_{N−1}; Q consultas "l r k" sobre [l, r) con k desde 0
 * Salida    : el k-ésimo menor (desde 0) de a_l … a_{r−1} para cada consulta
 * Complejidad: tiempo O((N + Q) log V) tras comprimir valores, memoria O(N log V)
 */

// Cada nivel parte los valores por la mitad del rango [lo, hi]: los ≤ mid van a la izquierda (orden estable).
// izq[x][i] = cuántos de los primeros i elementos del nodo x fueron a la izquierda.
struct Wavelet {
    int lo, hi;
    Wavelet *l = 0, *r = 0;
    vector<int> izq;
    Wavelet(vector<int>::iterator b, vector<int>::iterator e, int lo, int hi) : lo(lo), hi(hi) {
        if (lo == hi || b == e) return;
        int mid = (lo + hi) / 2;
        izq.reserve(e - b + 1); izq.push_back(0);
        for (auto it = b; it != e; it++) izq.push_back(izq.back() + (*it <= mid));
        auto pivote = stable_partition(b, e, [&](int x) { return x <= mid; });
        l = new Wavelet(b, pivote, lo, mid);
        r = new Wavelet(pivote, e, mid + 1, hi);
    }
    int kth(int a, int b, int k) {   // k-ésimo (desde 0) entre las posiciones [a, b) de este nodo
        if (lo == hi) return lo;
        int enIzq = izq[b] - izq[a];
        if (k < enIzq) return l->kth(izq[a], izq[b], k);
        return r->kth(a - izq[a], b - izq[b], k - enIzq);
    }
    int contarMenoresIgual(int a, int b, int x) {   // cuántos valores ≤ x en [a, b)
        if (a >= b || x < lo) return 0;
        if (hi <= x) return b - a;
        return l->contarMenoresIgual(izq[a], izq[b], x) + r->contarMenoresIgual(a - izq[a], b - izq[b], x);
    }
};

int main() {
    fastio;
    int N, Q;
    cin >> N >> Q;
    vector<int> a(N);
    for (auto &x : a) cin >> x;
    vector<int> vals = a;   // comprimir: los valores pasan a ser índices 0 … V − 1
    sort(all(vals)); vals.erase(unique(all(vals)), vals.end());
    for (auto &x : a) x = lower_bound(all(vals), x) - vals.begin();
    Wavelet wt(a.begin(), a.end(), 0, (int)vals.size() - 1);
    while (Q--) {
        int l, r, k;
        cin >> l >> r >> k;
        cout << vals[wt.kth(l, r, k)] << "\n";
    }
    return 0;
}
