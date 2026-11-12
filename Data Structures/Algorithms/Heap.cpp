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
 * Algoritmo : Cola de prioridad (min-heap) para asignar recursos
 * Problema  : CSES 1164 - Room Allocation (https://cses.fi/problemset/task/1164)
 * Entrada   : n, luego n pares "llegada salida"
 * Salida    : mínimo de habitaciones y la habitación de cada cliente
 * Complejidad: tiempo O(n log n), memoria O(n)
 */

int main() {
    fastio;
    int n;
    cin >> n;
    vector<array<int, 3>> c(n);  // {llegada, salida, índice}
    for (int i = 0; i < n; i++) {
        cin >> c[i][0] >> c[i][1];
        c[i][2] = i;
    }
    sort(all(c));

    // min-heap de {salida, habitación}
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> heap;
    vector<int> room(n);
    int rooms = 0;
    for (auto &cl : c) {
        int r;
        if (!heap.empty() && heap.top().first < cl[0]) {
            r = heap.top().second;
            heap.pop();
        }
        else r = ++rooms;
        room[cl[2]] = r;
        heap.push({cl[1], r});
    }

    cout << rooms << "\n";
    for (int x : room) cout << x << ' ';
    cout << "\n";
    return 0;
}
