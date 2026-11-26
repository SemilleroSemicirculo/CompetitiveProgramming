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
 * Algoritmo : Método símplex (programación lineal) con dos fases (basado en KACTL, CC0)
 * Problema  : Problema propio: maximizar c·x sujeto a A·x ≤ b, x ≥ 0
 * Entrada   : n m (variables y restricciones); c_1 … c_n; luego m filas "a_1 … a_n b"
 * Salida    : el valor óptimo con 6 decimales, o INFEASIBLE, o UNBOUNDED
 * Complejidad: exponencial en el peor caso, pero muy rápido en la práctica; memoria O(n · m)
 */

typedef long double T;
const T EPS = 1e-9;

// tabla D: filas = restricciones (+ objetivo y objetivo auxiliar); B = básicas, N = no básicas
struct LPSolver {
    int m, n;
    vector<int> N, B;
    vector<vector<T>> D;
    LPSolver(const vector<vector<T>> &A, const vector<T> &b, const vector<T> &c)
        : m(b.size()), n(c.size()), N(n + 1), B(m), D(m + 2, vector<T>(n + 2)) {
        for (int i = 0; i < m; i++) for (int j = 0; j < n; j++) D[i][j] = A[i][j];
        for (int i = 0; i < m; i++) { B[i] = n + i; D[i][n] = -1; D[i][n + 1] = b[i]; }   // holguras
        for (int j = 0; j < n; j++) { N[j] = j; D[m][j] = -c[j]; }
        N[n] = -1; D[m + 1][n] = 1;
    }
    // intercambia la básica de la fila r con la no básica de la columna s
    void pivot(int r, int s) {
        T inv = 1 / D[r][s];
        for (int i = 0; i < m + 2; i++) if (i != r && fabsl(D[i][s]) > EPS) {
            T f = D[i][s] * inv;
            for (int j = 0; j < n + 2; j++) D[i][j] -= D[r][j] * f;
            D[i][s] = D[r][s] * f;
        }
        for (int j = 0; j < n + 2; j++) if (j != s) D[r][j] *= inv;
        for (int i = 0; i < m + 2; i++) if (i != r) D[i][s] *= -inv;
        D[r][s] = inv;
        swap(B[r], N[s]);
    }
    // mejora el objetivo mientras alguna variable no básica tenga costo reducido negativo
    bool simplex(int fase) {
        int x = m + fase - 1;
        while (true) {
            int s = -1;
            for (int j = 0; j <= n; j++) if (N[j] != -fase)
                if (s == -1 || make_pair(D[x][j], N[j]) < make_pair(D[x][s], N[s])) s = j;   // regla de Bland
            if (D[x][s] >= -EPS) return true;   // óptimo
            int r = -1;
            for (int i = 0; i < m; i++) {
                if (D[i][s] <= EPS) continue;
                if (r == -1 || make_pair(D[i][n + 1] / D[i][s], B[i]) < make_pair(D[r][n + 1] / D[r][s], B[r])) r = i;
            }
            if (r == -1) return false;          // se puede crecer sin límite
            pivot(r, s);
        }
    }
    // devuelve el óptimo; −inf si no hay solución factible, +inf si no está acotado
    T solve() {
        int r = 0;
        for (int i = 1; i < m; i++) if (D[i][n + 1] < D[r][n + 1]) r = i;
        if (D[r][n + 1] < -EPS) {               // el origen no es factible: fase 1
            pivot(r, n);
            if (!simplex(2) || D[m + 1][n + 1] < -EPS) return -INFINITY;
            for (int i = 0; i < m; i++) if (B[i] == -1) {
                int s = 0;
                for (int j = 1; j <= n; j++)
                    if (make_pair(D[i][j], N[j]) < make_pair(D[i][s], N[s])) s = j;
                pivot(i, s);
            }
        }
        return simplex(1) ? D[m][n + 1] : INFINITY;
    }
};

int main() {
    fastio;
    int n, m;
    cin >> n >> m;
    vector<T> c(n), b(m);
    vector<vector<T>> A(m, vector<T>(n));
    for (T &x : c) cin >> x;
    for (int i = 0; i < m; i++) { for (T &x : A[i]) cin >> x; cin >> b[i]; }
    T res = LPSolver(A, b, c).solve();
    if (res == -INFINITY) cout << "INFEASIBLE\n";
    else if (res == INFINITY) cout << "UNBOUNDED\n";
    else { if (fabsl(res) < 5e-7) res = 0; precision(6); cout << (double)res << "\n"; }
    return 0;
}
