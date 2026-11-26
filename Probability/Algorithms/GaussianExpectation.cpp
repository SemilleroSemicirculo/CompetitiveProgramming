#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef long double ld;
const ll INF = numeric_limits<ll>::max();

#define all(x) x.begin(), x.end()
#define rall(x) x.rbegin(), x.rend()
#define MOD 998244353
#define pi acos(-1)
#define gcd __gcd
#define lcm(a, b) ((a) * (b) / gcd(a, b))
#define precision(n) cout << fixed << setprecision(n)
#define debug(arr) cerr << #arr << " = "; for (auto &x : arr) cerr << x << " "; cerr << endl;
#define fastio ios::sync_with_stdio(0); cin.tie(0); cout.tie(0);
/*
 * Algoritmo : Probabilidades y esperanzas con ciclos: sistema lineal resuelto con eliminación de Gauss
 * Problema  : Codeforces 113D - Museum (https://codeforces.com/problemset/problem/113/D)
 * Entrada   : n, m, a, b; m pasillos; luego p_1 … p_n (probabilidad de quedarse en el cuarto i)
 * Salida    : para cada cuarto, la probabilidad de que los dos amigos se encuentren allí
 * Complejidad: tiempo O(n⁶) = O(V³) con V = n² estados, memoria O(n⁴)
 */

int main() {
    fastio;
    int n, m, a, b;
    cin >> n >> m >> a >> b;
    a--; b--;
    vector<vector<int>> g(n);
    for (int i = 0; i < m; i++) {
        int u, v;
        cin >> u >> v;
        g[u - 1].push_back(v - 1);
        g[v - 1].push_back(u - 1);
    }
    vector<double> p(n);
    for (double &x : p) cin >> x;
    // T[i][k] = probabilidad de que alguien en el cuarto i esté en k al minuto siguiente
    vector<vector<double>> T(n, vector<double>(n, 0));
    for (int i = 0; i < n; i++) {
        T[i][i] = p[i];
        for (int k : g[i]) T[i][k] = (1 - p[i]) / g[i].size();
    }
    // estado (i, j) = posiciones de los dos amigos; con i = j ya se encontraron (absorbente).
    // x[s] = número esperado de minutos en que el par está en el estado s antes de encontrarse:
    //   x[s] = [s es el inicio] + Σ_{t no absorbente} x[t] · P(t → s)
    // Es un sistema lineal porque los estados se pueden repetir (hay ciclos): no sirve una DP.
    int V = n * n;
    auto id = [&](int i, int j) { return i * n + j; };
    vector<vector<double>> A(V, vector<double>(V + 1, 0));
    for (int s = 0; s < V; s++) A[s][s] = 1;
    A[id(a, b)][V] = 1;
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++) {
            if (i == j) continue;                                // desde absorbentes no se sale
            for (int k = 0; k < n; k++)
                for (int l = 0; l < n; l++)
                    if (T[i][k] > 0 && T[j][l] > 0) A[id(k, l)][id(i, j)] -= T[i][k] * T[j][l];
        }
    // eliminación de Gauss-Jordan con pivoteo parcial (se elige el mayor en valor absoluto)
    for (int c = 0; c < V; c++) {
        int piv = c;
        for (int r = c + 1; r < V; r++) if (fabs(A[r][c]) > fabs(A[piv][c])) piv = r;
        swap(A[c], A[piv]);
        for (int r = 0; r < V; r++) {
            if (r == c || A[r][c] == 0) continue;
            double f = A[r][c] / A[c][c];
            for (int k = c; k <= V; k++) A[r][k] -= f * A[c][k];
        }
    }
    // la probabilidad de encontrarse en k es la masa esperada que llega a (k, k)
    precision(10);
    for (int k = 0; k < n; k++) cout << A[id(k, k)][V] / A[id(k, k)][id(k, k)] << " \n"[k == n - 1];
    return 0;
}
