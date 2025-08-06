#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef long double ld;
const ll INF = numeric_limits<ll>::max();

#define all(x) x.begin(), x.end()
#define rall(x) x.rbegin(), x.rend()
#define MOD 998244353
// #define MOD pow(10, 9)+7;
// #define MOD 3245284303;
#define pi acos(-1)
#define gcd __gcd
#define lcm(a, b) ((a) * (b) / gcd(a, b))
#define precision(n) cout << fixed << setprecision(n)
#define debug(arr) cerr << #arr << " = "; for (auto &x : arr) cerr << x << " "; cerr << endl;
#define fastio ios::sync_with_stdio(0); cin.tie(0); cout.tie(0);

int main(){
    fastio;
    
    // Crear un deque
    deque<string> d = {"a", "b", "c"};
    cout << "Deque inicial: ";
    for (const auto& elem : d) {
        cout << elem << " ";
    }
    cout << endl;
    
    // Agregar un elemento a la derecha
    d.push_back("d");
    cout << "Despues de push_back: ";
    for (const auto& elem : d) {
        cout << elem << " ";
    }
    cout << endl;
    
    // Agregar un elemento a la izquierda
    d.push_front("z");
    cout << "Despues de push_front: ";
    for (const auto& elem : d) {
        cout << elem << " ";
    }
    cout << endl;
    
    // Remover el primer elemento (pop_front)
    string left_elem = d.front();
    d.pop_front();
    cout << "Elemento removido (pop_front): " << left_elem << endl;
    cout << "Deque tras pop_front: ";
    for (const auto& elem : d) {
        cout << elem << " ";
    }
    cout << endl;
    
    // Remover el ultimo elemento (pop_back)
    string right_elem = d.back();
    d.pop_back();
    cout << "Elemento removido (pop_back): " << right_elem << endl;
    cout << "Deque tras pop_back: ";
    for (const auto& elem : d) {
        cout << elem << " ";
    }
    cout << endl;
    
    return 0;
}