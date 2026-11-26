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
 * Algoritmo : Link-Cut Tree (bosque dinámico: unir, cortar y sumar caminos con splay trees). Basado en KACTL (CC0)
 * Problema  : Library Checker - Dynamic Tree Vertex Add Path Sum (https://judge.yosupo.jp/problem/dynamic_tree_vertex_add_path_sum)
 * Entrada   : N Q; valores a_0 … a_{N−1}; N − 1 aristas; Q consultas: "0 u v w x" quita (u, v) y agrega (w, x),
 *             "1 p x" hace a_p += x, "2 u v" pide la suma de los valores en el camino de u a v
 * Salida    : la respuesta de cada consulta de tipo 2
 * Complejidad: tiempo O((N + Q) log N) amortizado, memoria O(N)
 */

struct Node {
    Node *p = 0, *c[2] = {0, 0};
    bool flip = 0;          // marca perezosa: invertir el camino (para cambiar la raíz)
    ll val = 0, sum = 0;    // valor del vértice y suma de su splay
    void fix() {
        sum = val;
        for (Node *x : c) if (x) x->p = this, sum += x->sum;
    }
    void pushFlip() {
        if (!flip) return;
        flip = 0; swap(c[0], c[1]);
        for (Node *x : c) if (x) x->flip ^= 1;
    }
    int up() { return p ? p->c[1] == this ? 1 : p->c[0] == this ? 0 : -1 : -1; }   // -1: raíz de su splay
    void rot(int i, int b) {
        int h = i ^ b;
        Node *x = c[i], *y = b == 2 ? x : x->c[h], *z = b ? y : x;
        if ((y->p = p)) p->c[up()] = y;
        c[i] = z->c[i ^ 1];
        if (b < 2) { x->c[h] = y->c[h ^ 1]; y->c[h ^ 1] = x; }
        z->c[i ^ 1] = this;
        fix(); x->fix(); y->fix();
        if (p) p->fix();
        swap(pp, y->pp);
    }
    void splay() {   // subir este nodo a la raíz de su splay
        for (pushFlip(); p;) {
            if (p->p) p->p->pushFlip();
            p->pushFlip(); pushFlip();
            int c1 = up(), c2 = p->up();
            if (c2 == -1) p->rot(c1, 2);
            else p->p->rot(c2, c1 != c2);
        }
    }
    Node *first() { pushFlip(); return c[0] ? c[0]->first() : (splay(), this); }
    Node *pp = 0;   // puntero de camino: padre en el árbol real del tope de este camino preferido
};

struct LinkCut {
    vector<Node> node;
    LinkCut(int N) : node(N) {}
    void link(int u, int v) {   // agregar la arista (u, v): u pasa a ser hijo de v
        makeRoot(&node[u]);
        node[u].pp = &node[v];
    }
    void cut(int u, int v) {    // quitar la arista (u, v)
        Node *x = &node[u], *top = &node[v];
        makeRoot(top); x->splay();
        assert(top == (x->pp ?: x->c[0]));
        if (x->pp) x->pp = 0;
        else { x->c[0] = top->p = 0; x->fix(); }
    }
    void makeRoot(Node *u) {    // volver a u la raíz de su árbol: acceder e invertir el camino
        access(u); u->splay();
        if (u->c[0]) { u->c[0]->p = 0; u->c[0]->flip ^= 1; u->c[0]->pp = u; u->c[0] = 0; u->fix(); }
    }
    Node *access(Node *u) {     // dejar el camino raíz → u como un solo camino preferido
        u->splay();
        if (u->c[1]) { u->c[1]->p = 0; u->c[1]->pp = u; u->c[1] = 0; u->fix(); }   // lo más profundo sale del camino
        while (Node *pp = u->pp) {
            pp->splay(); u->pp = 0;
            if (pp->c[1]) { pp->c[1]->p = 0; pp->c[1]->pp = pp; }
            pp->c[1] = u; pp->fix(); u = pp;
        }
        return u;
    }
    void add(int u, ll x) { Node *a = &node[u]; access(a); a->splay(); a->val += x; a->fix(); }
    ll pathSum(int u, int v) {  // con u como raíz, el camino raíz → v es exactamente u … v
        makeRoot(&node[u]); access(&node[v]); node[v].splay();
        return node[v].sum;
    }
};

int main() {
    fastio;
    int N, Q;
    cin >> N >> Q;
    LinkCut lc(N);
    for (int i = 0; i < N; i++) { ll a; cin >> a; lc.add(i, a); }
    for (int i = 0; i < N - 1; i++) { int u, v; cin >> u >> v; lc.link(u, v); }
    while (Q--) {
        int t;
        cin >> t;
        if (t == 0) { int u, v, w, x; cin >> u >> v >> w >> x; lc.cut(u, v); lc.link(w, x); }
        else if (t == 1) { int p; ll x; cin >> p >> x; lc.add(p, x); }
        else { int u, v; cin >> u >> v; cout << lc.pathSum(u, v) << "\n"; }
    }
    return 0;
}
