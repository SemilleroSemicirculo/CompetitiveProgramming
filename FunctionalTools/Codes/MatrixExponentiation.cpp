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
 * Algoritmo : Exponenciación de matrices (Fibonacci en O(log n))
 * Problema  : CSES 1722 - Fibonacci Numbers (https://cses.fi/problemset/task/1722)
 * Entrada   : n
 * Salida    : F(n) módulo 10^9+7
 * Complejidad: tiempo O(k^3 log n), k = 2, memoria O(k^2)
 */

const ll MODM = 1000000007;  // este problema pide módulo 10^9+7

// matriz cuadrada
typedef vector<vector<ll>> Matrix;

// producto de matrices módulo MODM
Matrix multiply(const Matrix &A, const Matrix &B) {
    int k = A.size();
    Matrix C(k, vector<ll>(k, 0));
    for (int i = 0; i < k; i++)
        for (int j = 0; j < k; j++)
            for (int l = 0; l < k; l++)
                C[i][j] = (C[i][j] + A[i][l] * B[l][j]) % MODM;
    return C;
}

// exponenciación binaria: eleva la matriz en O(log e) multiplicaciones
Matrix power(Matrix A, ll e) {
    int k = A.size();
    Matrix R(k, vector<ll>(k, 0));
    for (int i = 0; i < k; i++) R[i][i] = 1;
    while (e > 0) {
        if (e & 1) R = multiply(R, A);
        A = multiply(A, A);
        e >>= 1;
    }
    return R;
}

int main() {
    fastio;
    ll n;
    cin >> n;
    // [F(n+1) F(n); F(n) F(n-1)] = [[1,1],[1,0]]^n
    // matriz de Fibonacci
    Matrix M = {{1, 1}, {1, 0}};
    cout << power(M, n)[0][1] << "\n";
    return 0;
}
