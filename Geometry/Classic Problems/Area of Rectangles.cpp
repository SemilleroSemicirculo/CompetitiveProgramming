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
 * Algoritmo : Línea de barrido + Segment Tree de cobertura (área de la unión de rectángulos)
 * Problema  : CSES 1741 - Area of Rectangles (https://cses.fi/problemset/task/1741)
 * Entrada   : n, luego n rectángulos "x1 y1 x2 y2"
 * Salida    : el área total cubierta por la unión
 * Complejidad: tiempo O(n log n), memoria O(n)
 */

vector<ll> ys;           // alturas comprimidas
vector<int> cnt;          // cnt[v] = cuántos rectángulos cubren entero el tramo del nodo v
vector<ll> len;           // len[v] = largo cubierto dentro del tramo del nodo v

// el nodo v cubre los intervalos elementales [ys[l], ys[l+1]), ..., [ys[r], ys[r+1])
void update(int v, int l, int r, int a, int b, int d) {
    if (b < l || r < a) return;
    if (a <= l && r <= b) cnt[v] += d;
    else {
        int m = (l + r) / 2;
        update(2 * v, l, m, a, b, d);
        update(2 * v + 1, m + 1, r, a, b, d);
    }
    // si algo lo cubre entero, todo su tramo cuenta; si no, lo que aporten sus hijos
    if (cnt[v] > 0) len[v] = ys[r + 1] - ys[l];
    else len[v] = (l == r) ? 0 : len[2 * v] + len[2 * v + 1];
}

int main() {
    fastio;
    int n;
    cin >> n;
    vector<array<ll, 4>> ev;  // (x, +1/-1, y1, y2)
    for (int i = 0; i < n; i++) {
        ll x1, y1, x2, y2;
        cin >> x1 >> y1 >> x2 >> y2;
        ev.push_back({x1, 1, y1, y2});
        ev.push_back({x2, -1, y1, y2});
        ys.push_back(y1), ys.push_back(y2);
    }
    sort(all(ys));
    ys.erase(unique(all(ys)), ys.end());
    int m = ys.size() - 1;  // intervalos elementales
    cnt.assign(4 * m + 4, 0), len.assign(4 * m + 4, 0);
    sort(all(ev));
    ll area = 0;
    for (int i = 0; i < (int)ev.size(); i++) {
        // entre el evento anterior y este, el largo cubierto en y no cambia: se suma la franja
        if (i > 0) area += len[1] * (ev[i][0] - ev[i - 1][0]);
        int a = lower_bound(all(ys), ev[i][2]) - ys.begin();
        int b = lower_bound(all(ys), ev[i][3]) - ys.begin() - 1;
        update(1, 0, m - 1, a, b, (int)ev[i][1]);
    }
    cout << area << "\n";
    return 0;
}
