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
 * Algoritmo : Tamaños de subárbol en un árbol con raíz
 * Problema  : CSES 1674 - Subordinates (https://cses.fi/problemset/task/1674)
 * Entrada   : n, luego el jefe directo de cada empleado 2..n
 * Salida    : para cada empleado, la cantidad de subordinados (tamaño de su subárbol menos 1)
 * Complejidad: tiempo O(n), memoria O(n)
 */

int main() {
    fastio;
    int n;
    cin >> n;
    vector<int> boss(n + 1, 0);
    vector<vector<int>> kids(n + 1);
    for (int i = 2; i <= n; i++) {
        cin >> boss[i];
        kids[boss[i]].push_back(i);
    }
    // orden BFS desde el director: todo jefe aparece antes que sus subordinados
    vector<int> order = {1};
    for (int k = 0; k < (int)order.size(); k++)
        for (int v : kids[order[k]]) order.push_back(v);
    // se recorre al revés: cuando se procesa a alguien, sus subordinados ya están contados
    vector<int> sub(n + 1, 0);
    for (int k = n - 1; k >= 1; k--) {
        int v = order[k];
        sub[boss[v]] += sub[v] + 1;
    }
    for (int v = 1; v <= n; v++) cout << sub[v] << ' ';
    cout << "\n";
    return 0;
}
