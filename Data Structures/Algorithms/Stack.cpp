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
 * Algoritmo : Pila monótona (menor valor anterior)
 * Problema  : CSES 1645 - Nearest Smaller Values (https://cses.fi/problemset/task/1645)
 * Entrada   : n, luego n enteros
 * Salida    : para cada posición, el índice (base 1) del elemento menor más cercano a la izquierda, o 0
 * Complejidad: tiempo O(n), memoria O(n)
 */

int main() {
    fastio;
    int n;
    cin >> n;
    vector<ll> a(n);
    for (auto &x : a) cin >> x;

    // la pila guarda índices con valores estrictamente crecientes
    // se mantienen los candidatos a "menor más cercano"
    stack<int> st;
    for (int i = 0; i < n; i++) {
        // los mayores o iguales a a[i] ya no sirven para elementos futuros
        while (!st.empty() && a[st.top()] >= a[i]) st.pop();
        // el tope es el menor más cercano a la izquierda (o 0 si no hay)
        cout << (st.empty() ? 0 : st.top() + 1) << ' ';
        // a[i] es candidato para los siguientes
        st.push(i);
    }
    cout << "\n";
    return 0;
}
