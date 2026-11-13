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
 * Algoritmo : Envolvente convexa (Graham scan, incluye puntos colineales del borde)
 * Problema  : CSES 2195 - Convex Hull (https://cses.fi/problemset/task/2195)
 * Entrada   : n, luego n puntos enteros "x y"
 * Salida    : cantidad de puntos de la envolvente (incluye los del borde) y sus coordenadas
 * Complejidad: tiempo O(n log n), memoria O(n)
 */

// punto del plano con coordenadas enteras
struct pt {
    ll x, y;  // Funcionan como parejas
    bool operator==(pt const &t) const {
        return x == t.x && y == t.y;
    }
};

// signo del producto cruz (b - a) x (c - a)
int orientation(pt a, pt b, pt c) {
    ll v = a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y);  // Producto cruz
    if (v < 0) return -1;  // a-b-c Horario
    if (v > 0) return +1;  // a-b-c Antihorario
    return 0;
}

// cw verifica si a-b-c va en sentido horario
bool cw(pt a, pt b, pt c, bool include_collinear) {
    int o = orientation(a, b, c);
    return o < 0 || (include_collinear && o == 0);
}

bool collinear(pt a, pt b, pt c) { return orientation(a, b, c) == 0; }

// Graham scan: se ordena por ángulo alrededor del punto más bajo
void convex_hull(vector<pt> &a, bool include_collinear = false) {
    pt p0 = *min_element(all(a), [](pt a, pt b) {
        return make_pair(a.y, a.x) < make_pair(b.y, b.x);
    });  // encuentra el punto más abajo a la izquierda
    sort(all(a), [&p0](const pt &a, const pt &b) {
        int o = orientation(p0, a, b);
        if (o == 0)
            return (p0.x - a.x) * (p0.x - a.x) + (p0.y - a.y) * (p0.y - a.y)
                 < (p0.x - b.x) * (p0.x - b.x) + (p0.y - b.y) * (p0.y - b.y);
        return o < 0;  // Criterio de comparacion para ordenar
    });
    // con puntos colineales en el borde final, se invierte esa última parte
    if (include_collinear) {
        int i = (int)a.size() - 1;
        while (i >= 0 && collinear(p0, a[i], a.back())) i--;
        reverse(a.begin() + i + 1, a.end());
    }

    // pila de la envolvente
    vector<pt> st;
    for (int i = 0; i < (int)a.size(); i++) {
        // Verifica si los dos anteriores con el actual van en sentido horario
        while (st.size() > 1 && !cw(st[st.size() - 2], st.back(), a[i], include_collinear))
            st.pop_back();
        st.push_back(a[i]);
    }

    // caso degenerado de puntos repetidos
    if (include_collinear == false && st.size() == 2 && st[0] == st[1])
        st.pop_back();

    a = st;
}

int main() {
    fastio;
    int n;
    cin >> n;
    vector<pt> points(n);
    for (auto &p : points) cin >> p.x >> p.y;

    convex_hull(points, true);
    cout << points.size() << "\n";
    for (auto &p : points) cout << p.x << ' ' << p.y << "\n";
    return 0;
}
