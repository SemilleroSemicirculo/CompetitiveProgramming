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
 * Algoritmo : Línea de barrido + Fenwick Tree (cruces entre segmentos horizontales y verticales)
 * Problema  : CSES 1740 - Intersection Points (https://cses.fi/problemset/task/1740)
 * Entrada   : n, luego n segmentos horizontales o verticales "x1 y1 x2 y2"
 * Salida    : cantidad de puntos de intersección
 * Complejidad: tiempo O(n log C) con C = rango de coordenadas, memoria O(C)
 */

const int OFF = 1000001, C = 2000003;  // y + OFF queda en [1, C)
vector<ll> bit(C + 1, 0);
void add(int i, ll v) { for (; i <= C; i += i & -i) bit[i] += v; }
ll sum(int i) { ll s = 0; for (; i > 0; i -= i & -i) s += bit[i]; return s; }

int main() {
    fastio;
    int n;
    cin >> n;
    // eventos por x: tipo 0 = empieza horizontal, 1 = vertical (consulta), 2 = termina horizontal
    vector<array<int, 4>> ev;
    for (int i = 0; i < n; i++) {
        int x1, y1, x2, y2;
        cin >> x1 >> y1 >> x2 >> y2;
        if (y1 == y2) ev.push_back({x1, 0, y1, 0}), ev.push_back({x2, 2, y1, 0});
        else ev.push_back({x1, 1, y1, y2});
    }
    // se barre de izquierda a derecha; el Fenwick cuenta las horizontales activas en cada altura y
    sort(all(ev));
    ll total = 0;
    for (auto &[x, t, a, b] : ev) {
        if (t == 0) add(a + OFF, 1);
        else if (t == 2) add(a + OFF, -1);
        else total += sum(b + OFF) - sum(a + OFF - 1);  // horizontales activas con y en [y1, y2]
    }
    cout << total << "\n";
    return 0;
}
