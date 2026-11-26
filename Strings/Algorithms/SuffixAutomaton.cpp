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
 * Algoritmo : Autómata de sufijos (el menor autómata que reconoce todos los sufijos de s)
 * Problema  : CSES 2105 - Distinct Substrings (https://cses.fi/problemset/task/2105)
 * Entrada   : una cadena s (|s| ≤ 10^5, letras a–z)
 * Salida    : la cantidad de subcadenas distintas de s
 * Complejidad: tiempo O(|s| · σ), memoria O(|s| · σ); tiene a lo sumo 2|s| − 1 estados
 */

struct Estado {
    int len, link;          // largo de la subcadena más larga del estado y enlace de sufijo
    array<int, 26> nxt;
};
vector<Estado> st;
int ultimo;

void extender(int c) {
    int cur = st.size();
    st.push_back({st[ultimo].len + 1, -1, {}});
    st[cur].nxt.fill(-1);
    int p = ultimo;
    // todos los sufijos del texto viejo que no tenían la letra c ahora la tienen hacia cur
    while (p != -1 && st[p].nxt[c] == -1) { st[p].nxt[c] = cur; p = st[p].link; }
    if (p == -1) st[cur].link = 0;
    else {
        int q = st[p].nxt[c];
        if (st[p].len + 1 == st[q].len) st[cur].link = q;
        else {
            // q mezcla subcadenas de dos largos: se clona para separar las que ahora son sufijo
            int clon = st.size();
            st.push_back({st[p].len + 1, st[q].link, st[q].nxt});
            while (p != -1 && st[p].nxt[c] == q) { st[p].nxt[c] = clon; p = st[p].link; }
            st[q].link = st[cur].link = clon;
        }
    }
    ultimo = cur;
}

int main() {
    fastio;
    string s;
    cin >> s;
    st.reserve(2 * s.size() + 1);
    st.push_back({0, -1, {}});
    st[0].nxt.fill(-1);
    ultimo = 0;
    for (char ch : s) extender(ch - 'a');
    // cada estado v representa las subcadenas de largos (len[link[v]], len[v]]
    ll total = 0;
    for (int v = 1; v < (int)st.size(); v++) total += st[v].len - st[st[v].link].len;
    cout << total << "\n";
    return 0;
}
