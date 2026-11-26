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
 * Algoritmo : Juego de Nim (teorema de Bouton: gana quien empieza si el xor de las pilas no es 0)
 * Problema  : CSES 1730 - Nim Game I (https://cses.fi/problemset/task/1730)
 * Entrada   : t juegos; cada uno con n y luego las n pilas x_1 … x_n
 * Salida    : "first" si gana el primer jugador y "second" si no, por juego
 * Complejidad: tiempo O(n) por juego, memoria O(1)
 */

int main() {
    fastio;
    int t;
    cin >> t;
    while (t--) {
        int n;
        cin >> n;
        ll x = 0;
        for (int i = 0; i < n; i++) {
            ll a;
            cin >> a;
            x ^= a;   // suma de Nim
        }
        // xor ≠ 0: siempre hay una jugada que lo deja en 0; xor = 0: toda jugada lo rompe
        cout << (x ? "first" : "second") << "\n";
    }
    return 0;
}
