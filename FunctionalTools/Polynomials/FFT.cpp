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
 * Algoritmo : Transformada rápida de Fourier (FFT) para multiplicar polinomios (basado en KACTL, CC0)
 * Problema  : CSES 2112 - Apples and Bananas (https://cses.fi/problemset/task/2112)
 * Entrada   : k, n, m; los pesos de n manzanas y de m bananos (entre 1 y k)
 * Salida    : para cada peso w = 2 … 2k, cuántos pares (manzana, banano) pesan w en total
 * Complejidad: tiempo O(k log k), memoria O(k)
 */

typedef complex<double> cd;

// FFT iterativa en el lugar; con inv = true calcula la inversa (sin dividir por n)
void fft(vector<cd> &a, bool inv) {
    int n = a.size();
    // permutación por inversión de bits: deja cada coeficiente donde lo necesita la mariposa
    for (int i = 1, j = 0; i < n; i++) {
        int bit = n >> 1;
        for (; j & bit; bit >>= 1) j ^= bit;
        j ^= bit;
        if (i < j) swap(a[i], a[j]);
    }
    // raíces de la unidad precalculadas en long double para no acumular error
    vector<cd> rt(n);
    for (int i = 0; i < n / 2; i++) {
        long double ang = 2 * acosl(-1) * i / n * (inv ? -1 : 1);
        rt[i] = cd(cosl(ang), sinl(ang));
    }
    for (int len = 2; len <= n; len <<= 1)
        for (int i = 0; i < n; i += len)
            for (int j = 0; j < len / 2; j++) {
                cd u = a[i + j], v = a[i + j + len / 2] * rt[n / len * j];
                a[i + j] = u + v;                 // A(w) = Par(w²) + w·Impar(w²)
                a[i + j + len / 2] = u - v;       // A(−w) = Par(w²) − w·Impar(w²)
            }
}

vector<ll> multiply(const vector<ll> &a, const vector<ll> &b) {
    int need = a.size() + b.size() - 1, n = 1;
    while (n < need) n <<= 1;
    vector<cd> fa(all(a)), fb(all(b));
    fa.resize(n); fb.resize(n);
    fft(fa, false); fft(fb, false);
    for (int i = 0; i < n; i++) fa[i] *= fb[i];   // en valores, multiplicar es punto a punto
    fft(fa, true);
    vector<ll> c(need);
    for (int i = 0; i < need; i++) c[i] = llround(fa[i].real() / n);
    return c;
}

int main() {
    fastio;
    int k, n, m;
    cin >> k >> n >> m;
    vector<ll> A(k + 1, 0), B(k + 1, 0);   // A[w] = manzanas que pesan w
    for (int i = 0; i < n; i++) { int w; cin >> w; A[w]++; }
    for (int i = 0; i < m; i++) { int w; cin >> w; B[w]++; }
    vector<ll> C = multiply(A, B);          // C[w] = Σ A[i]·B[w − i]
    for (int w = 2; w <= 2 * k; w++) cout << C[w] << " \n"[w == 2 * k];
    return 0;
}
