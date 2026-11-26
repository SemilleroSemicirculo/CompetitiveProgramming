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
 * Algoritmo : Teorema de Sprague-Grundy (números de Grundy con mex y suma de juegos con xor)
 * Problema  : Kattis - S-Nim (https://open.kattis.com/problems/snim)
 * Entrada   : k y los tamaños permitidos s_1 … s_k; m; luego m posiciones "l h_1 … h_l" (h ≤ 10^4)
 * Salida    : una línea con una letra por posición: W si gana quien mueve, L si pierde
 * Complejidad: tiempo O(H · k + Σ l), memoria O(H) con H = 10^4
 */

const int H = 10000;

int main() {
    fastio;
    int k;
    cin >> k;
    vector<int> s(k);
    for (int &x : s) cin >> x;
    // g[h] = mex { g[h − s_i] }: el menor número que no se alcanza con una jugada
    vector<int> g(H + 1, 0);
    for (int h = 1; h <= H; h++) {
        vector<bool> visto(k + 1, false);   // el mex de k valores es a lo sumo k
        for (int x : s)
            if (x <= h && g[h - x] <= k) visto[g[h - x]] = true;
        while (visto[g[h]]) g[h]++;
    }
    int m;
    cin >> m;
    string res;
    while (m--) {
        int l;
        cin >> l;
        int x = 0;
        for (int i = 0; i < l; i++) {
            int h;
            cin >> h;
            x ^= g[h];   // una suma de juegos tiene como Grundy el xor de los Grundy
        }
        res += x ? 'W' : 'L';
    }
    cout << res << "\n";
    return 0;
}
