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
 * Algoritmo : Hopcroft-Karp (emparejamiento bipartito máximo en O(E·√V))
 * Problema  : Library Checker - Matching on Bipartite Graph (https://judge.yosupo.jp/problem/bipartitematching)
 * Entrada   : L, R, M; luego M aristas a b (0 ≤ a < L, 0 ≤ b < R)
 * Salida    : el tamaño K del emparejamiento máximo y luego K parejas "a b"
 * Complejidad: tiempo O(E · √V), memoria O(V + E)
 */

int L, R;
vector<vector<int>> g;
vector<int> mL, mR, dist;   // mL[a] = pareja de a (−1 si libre); dist = capas del BFS

// BFS desde todos los izquierdos libres; capas alternando arista libre / arista emparejada
bool bfs() {
    queue<int> q;
    for (int a = 0; a < L; a++) {
        dist[a] = mL[a] == -1 ? 0 : -1;
        if (dist[a] == 0) q.push(a);
    }
    bool hay = false;
    while (!q.empty()) {
        int a = q.front(); q.pop();
        for (int b : g[a]) {
            int c = mR[b];
            if (c == -1) hay = true;                          // camino aumentante encontrado
            else if (dist[c] == -1) { dist[c] = dist[a] + 1; q.push(c); }
        }
    }
    return hay;
}

// DFS solo por las capas del BFS (como Dinic); it[] evita revisar dos veces la misma arista
vector<int> it;
bool dfs(int a) {
    for (int &i = it[a]; i < (int)g[a].size(); i++) {
        int b = g[a][i], c = mR[b];
        if (c == -1 || (dist[c] == dist[a] + 1 && dfs(c))) {
            mL[a] = b; mR[b] = a;
            return true;
        }
    }
    dist[a] = -1;   // sin salida: no volver a entrar en esta fase
    return false;
}

int main() {
    fastio;
    int M;
    cin >> L >> R >> M;
    g.assign(L, {});
    for (int i = 0; i < M; i++) {
        int a, b;
        cin >> a >> b;
        g[a].push_back(b);
    }
    mL.assign(L, -1); mR.assign(R, -1); dist.assign(L, -1); it.assign(L, 0);
    int K = 0;
    // cada fase aumenta por caminos disjuntos de largo mínimo; hay O(√V) fases
    while (bfs()) {
        fill(all(it), 0);
        for (int a = 0; a < L; a++) if (mL[a] == -1 && dfs(a)) K++;
    }
    cout << K << "\n";
    for (int a = 0; a < L; a++) if (mL[a] != -1) cout << a << " " << mL[a] << "\n";
    return 0;
}
