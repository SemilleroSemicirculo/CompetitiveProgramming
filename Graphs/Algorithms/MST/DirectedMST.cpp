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
 * Algoritmo : Arborescencia de costo mínimo (Chu-Liu/Edmonds con montículos sesgados y DSU con deshacer). Basado en KACTL (CC0)
 * Problema  : Library Checker - Directed MST (https://judge.yosupo.jp/problem/directedmst)
 * Entrada   : N M S; M arcos "a b c" (0-indexados, costo c); S es la raíz (se garantiza que todos son alcanzables)
 * Salida    : el costo mínimo X y luego p_0 … p_{N−1}, el padre de cada vértice (p_S = S)
 * Complejidad: tiempo O(M log M), memoria O(N + M)
 */

struct Edge { int a, b; ll w; };
struct Node {   // montículo sesgado con suma perezosa: los arcos que entran a un (super)vértice
    Edge key;
    Node *l, *r;
    ll delta;
    void prop() {
        key.w += delta;
        if (l) l->delta += delta;
        if (r) r->delta += delta;
        delta = 0;
    }
    Edge top() { prop(); return key; }
};
Node *merge(Node *a, Node *b) {
    if (!a || !b) return a ?: b;
    a->prop(), b->prop();
    if (a->key.w > b->key.w) swap(a, b);
    swap(a->l, (a->r = merge(b, a->r)));
    return a;
}
void pop(Node *&a) { a->prop(); a = merge(a->l, a->r); }

struct RollbackUF {
    vector<int> e;
    vector<pair<int, int>> st;
    RollbackUF(int n) : e(n, -1) {}
    int find(int x) { return e[x] < 0 ? x : find(e[x]); }
    int time() { return st.size(); }
    void rollback(int t) {
        for (int i = time(); i-- > t;) e[st[i].first] = st[i].second;
        st.resize(t);
    }
    bool join(int a, int b) {
        a = find(a), b = find(b);
        if (a == b) return false;
        if (e[a] > e[b]) swap(a, b);
        st.push_back({a, e[a]}); st.push_back({b, e[b]});
        e[a] += e[b]; e[b] = a;
        return true;
    }
};

// Cada vértice toma su arco de entrada más barato. Si eso cierra un ciclo, el ciclo se contrae a un
// supervértice y los arcos que entran a él se abaratan en lo que ya se pagó (por eso la suma perezosa).
pair<ll, vector<int>> dmst(int n, int r, vector<Edge> &g) {
    RollbackUF uf(n);
    vector<Node *> heap(n);
    for (Edge e : g) heap[e.b] = merge(heap[e.b], new Node{e, 0, 0, 0});
    ll res = 0;
    vector<int> seen(n, -1), path(n), par(n);
    seen[r] = r;
    vector<Edge> Q(n), in(n, {-1, -1, 0});
    deque<tuple<int, int, vector<Edge>>> cycs;
    for (int s = 0; s < n; s++) {
        int u = s, qi = 0, w;
        while (seen[u] < 0) {
            if (!heap[u]) return {-1, {}};
            Edge e = heap[u]->top();
            heap[u]->delta -= e.w, pop(heap[u]);
            Q[qi] = e, path[qi++] = u, seen[u] = s;
            res += e.w, u = uf.find(e.a);
            if (seen[u] == s) {   // se cerró un ciclo: contraerlo
                Node *cyc = 0;
                int end = qi, time = uf.time();
                do cyc = merge(cyc, heap[w = path[--qi]]);
                while (uf.join(u, w));
                u = uf.find(u), heap[u] = cyc, seen[u] = -1;
                cycs.push_front({u, time, {&Q[qi], &Q[end]}});
            }
        }
        for (int i = 0; i < qi; i++) in[uf.find(Q[i].b)] = Q[i];
    }
    for (auto &[u, t, comp] : cycs) {   // reconstruir los padres deshaciendo las contracciones
        uf.rollback(t);
        Edge inEdge = in[u];
        for (auto &e : comp) in[uf.find(e.b)] = e;
        in[uf.find(inEdge.b)] = inEdge;
    }
    for (int i = 0; i < n; i++) par[i] = in[i].a;
    return {res, par};
}

int main() {
    fastio;
    int n, m, s;
    cin >> n >> m >> s;
    vector<Edge> g(m);
    for (auto &e : g) cin >> e.a >> e.b >> e.w;
    auto [cost, par] = dmst(n, s, g);
    par[s] = s;
    cout << cost << "\n";
    for (int i = 0; i < n; i++) cout << par[i] << " \n"[i == n - 1];
    return 0;
}
