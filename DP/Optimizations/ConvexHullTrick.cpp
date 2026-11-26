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
 * Algoritmo : Convex Hull Trick con pendientes y consultas monótonas (deque de rectas)
 * Problema  : CSES 2084 - Monster Game I (https://cses.fi/problemset/task/2084)
 * Entrada   : n, x; fuerzas s_1 < … < s_n; factores x ≥ f_1 ≥ … ≥ f_n
 * Salida    : el tiempo mínimo para matar al monstruo n (matar el i con factor f cuesta s_i · f)
 * Complejidad: tiempo O(n), memoria O(n)
 */

// recta y = m·x + b; para dp[i] = min_j (f_j · s_i + dp[j]) cada j aporta la recta (f_j, dp[j])
struct Line {
    ll m, b;
    ll eval(ll x) const { return m * x + b; }
};

// ¿la recta del medio (l2) sobra entre l1 y l3? (pendientes decrecientes, se busca el mínimo)
// l2 sobra si l3 corta a l1 antes (o en el mismo x) que l2 corta a l1
bool sobra(const Line &l1, const Line &l2, const Line &l3) {
    return (__int128)(l3.b - l1.b) * (l1.m - l2.m) <= (__int128)(l2.b - l1.b) * (l1.m - l3.m);
}

int main() {
    fastio;
    int n;
    ll x;
    cin >> n >> x;
    vector<ll> s(n), f(n);
    for (ll &v : s) cin >> v;
    for (ll &v : f) cin >> v;
    deque<Line> hull;
    hull.push_back({x, 0});   // antes de matar a nadie: factor x y tiempo 0
    ll dp = 0;
    for (int i = 0; i < n; i++) {
        // las consultas s_i crecen: las rectas del frente que ya perdieron no vuelven a ganar
        while (hull.size() >= 2 && hull[1].eval(s[i]) <= hull[0].eval(s[i])) hull.pop_front();
        dp = hull[0].eval(s[i]);
        Line nueva = {f[i], dp};
        // las pendientes f_i decrecen: la nueva va al final y saca las que quedan tapadas
        if (hull.back().m == nueva.m) {
            if (hull.back().b <= nueva.b) continue;   // misma pendiente y peor: no sirve
            hull.pop_back();
        }
        while (hull.size() >= 2 && sobra(hull[hull.size() - 2], hull.back(), nueva)) hull.pop_back();
        hull.push_back(nueva);
    }
    cout << dp << "\n";
    return 0;
}
