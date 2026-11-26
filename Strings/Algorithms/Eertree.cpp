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
 * Algoritmo : Eertree (árbol de palíndromos: un nodo por cada palíndromo distinto)
 * Problema  : APIO 2014 - Palindromes (https://oj.uz/problem/view/APIO14_palindrome)
 * Entrada   : una cadena s de minúsculas (|s| ≤ 3·10^5)
 * Salida    : el máximo, entre los palíndromos de s, de (longitud × cantidad de apariciones)
 * Complejidad: tiempo O(|s| · σ), memoria O(|s| · σ)
 */

// Dos raíces: la de longitud −1 (para palíndromos impares) y la de longitud 0 (pares).
// Al leer s[i] se baja por los enlaces de sufijo desde el palíndromo sufijo más largo hasta
// encontrar uno que se pueda extender con s[i] a ambos lados: a lo sumo un nodo nuevo por letra.
struct Eertree {
    vector<array<int, 26>> nxt;
    vector<int> len, link;
    vector<ll> cnt;   // veces que el nodo fue el palíndromo sufijo más largo
    string s;
    int last = 1;
    Eertree() { nuevo(-1, 0); nuevo(0, 0); }   // nodo 0: longitud −1; nodo 1: longitud 0 (enlace a 0)
    int nuevo(int l, int lk) { nxt.push_back({}); nxt.back().fill(0); len.push_back(l); link.push_back(lk); cnt.push_back(0); return len.size() - 1; }
    int subir(int v, int i) {   // el primer sufijo palíndromo de v que tiene s[i] justo antes
        while (i - 1 - len[v] < 0 || s[i - 1 - len[v]] != s[i]) v = link[v];
        return v;
    }
    void agregar(char ch) {
        s += ch;
        int i = s.size() - 1, c = ch - 'a';
        int v = subir(last, i);
        if (!nxt[v][c]) {
            int lk = v == 0 ? 1 : nxt[subir(link[v], i)][c];   // enlace del nuevo: siguiente extensión posible
            int u = nuevo(len[v] + 2, lk);
            nxt[v][c] = u;
        }
        last = nxt[v][c];
        cnt[last]++;
    }
};

int main() {
    fastio;
    string s;
    cin >> s;
    Eertree t;
    for (char c : s) t.agregar(c);
    // un palíndromo aparece también cada vez que aparece un palíndromo que lo tiene como sufijo:
    // se acumula cnt hacia los enlaces, de los nodos más largos a los más cortos (orden de creación inverso)
    ll best = 0;
    for (int v = (int)t.len.size() - 1; v >= 2; v--) {
        best = max(best, t.cnt[v] * t.len[v]);
        t.cnt[t.link[v]] += t.cnt[v];
    }
    cout << best << "\n";
    return 0;
}
