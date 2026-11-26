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
 * Algoritmo : Lema de Burnside (contar objetos salvo simetrías: promedio de puntos fijos)
 * Problema  : CSES 2209 - Counting Necklaces (https://cses.fi/problemset/task/2209)
 * Entrada   : n m: collares de n perlas con m colores, iguales si uno es rotación del otro
 * Salida    : cuántos collares distintos hay, módulo 10^9 + 7
 * Complejidad: tiempo O(n log n), memoria O(1)
 */

const ll P = 1000000007;
ll power(ll b, ll e) { ll r = 1; b %= P; for (; e; e >>= 1, b = b * b % P) if (e & 1) r = r * b % P; return r; }

int main() {
    fastio;
    ll n, m;
    cin >> n >> m;
    // la rotación por i posiciones parte el collar en gcd(i, n) ciclos; un coloreo queda fijo
    // si cada ciclo es de un solo color: m^gcd(i, n) coloreos fijos
    ll suma = 0;
    for (ll i = 0; i < n; i++) suma = (suma + power(m, __gcd(i, n))) % P;
    // Burnside: clases = promedio de coloreos fijos sobre las n rotaciones
    cout << suma * power(n, P - 2) % P << "\n";
    return 0;
}
