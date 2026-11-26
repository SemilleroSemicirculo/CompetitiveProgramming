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
 * Algoritmo : DP de probabilidades sobre el estado (blancos, negros)
 * Problema  : Codeforces 148D - Bag of mice (https://codeforces.com/problemset/problem/148/D)
 * Entrada   : w b (ratones blancos y negros)
 * Salida    : probabilidad de que gane la princesa (error ≤ 10^-9)
 * Complejidad: tiempo O(w · b), memoria O(w · b)
 */

int main() {
    fastio;
    int W, B;
    cin >> W >> B;
    // P[w][b] = probabilidad de que gane la princesa si le toca sacar con w blancos y b negros
    vector<vector<double>> P(W + 1, vector<double>(B + 1, 0.0));
    for (int w = 1; w <= W; w++) P[w][0] = 1.0;  // solo hay blancos: gana de inmediato
    for (int w = 1; w <= W; w++)
        for (int b = 1; b <= B; b++) {
            double t = w + b;
            double res = w / t;  // saca blanco y gana
            // si saca negro, el dragón debe sacar negro también (si saca blanco, gana él)
            if (b >= 2) {
                double both = (b / t) * ((b - 1) / (t - 1));
                // luego salta un ratón al azar: blanco o negro
                if (b >= 2 && w >= 1 && t - 2 > 0) res += both * (w / (t - 2)) * P[w - 1][b - 2];
                if (b >= 3) res += both * ((b - 2) / (t - 2)) * P[w][b - 3];
            }
            P[w][b] = res;
        }
    precision(9);
    cout << P[W][B] << "\n";
    return 0;
}
