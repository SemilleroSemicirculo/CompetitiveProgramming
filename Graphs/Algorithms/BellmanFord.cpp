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

struct Edge { int u, v; ll w; };

// Ejecuta Bellman–Ford desde la fuente 0, escribe distancias y retorna si hay ciclo negativo
bool bellman_ford(const vector<Edge>& edges, int V, vector<ll>& dist) {
    dist.assign(V, INF);
    dist[0] = 0;
    if (V == 1) return false;

    // V-1 relajaciones
    for (int i = 0; i < V - 1; i++) {
        bool changed = false;
        for (auto &e : edges) {
            if (dist[e.u] != INF && dist[e.u] + e.w < dist[e.v]) {
                dist[e.v] = dist[e.u] + e.w;
                changed = true;
            }
        }
        if (!changed) break;
    }

    // pasada extra para detectar ciclo negativo
    for (auto &e : edges) {
        if (dist[e.u] != INF && dist[e.u] + e.w < dist[e.v]) {
            return true;
        }
    }
    return false;
}

int main() {
    fastio;
    int C; 
    cin >> C;
    while (C--) {
        int n, m;
        cin >> n >> m;
        vector<Edge> edges;
        edges.reserve(m);
        for (int i = 0; i < m; i++) {
            int x, y; ll t;
            cin >> x >> y >> t;
            edges.push_back({x, y, t});
        }

        vector<ll> dist;
        bool hasNeg = bellman_ford(edges, n, dist);

        // Imprimir distancias
        for (int i = 0; i < n; i++) {
            if (dist[i] == INF) 
                cout << "INF";
            else 
                cout << dist[i];
            cout << (i+1<n ? ' ' : '\n');
        }

        // Indicar si hay ciclo negativo
        cout << (hasNeg ? "possible\n" : "not possible\n");
    }
    return 0;
}
