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
    
    stack<string> st;
    st.push("a");
    st.push("b");
    st.push("c");
    
    cout << "Pila inicial: ";
    stack<string> temp = st;
    vector<string> elements;
    while (!temp.empty()) {
        elements.push_back(temp.top());
        temp.pop();
    }
    reverse(elements.begin(), elements.end());
    for (const auto& elem : elements) {
        cout << elem << " ";
    }
    cout << endl;

    // Remover el elemento superior (LIFO)
    string top = st.top();
    st.pop();
    cout << "Elemento removido: " << top << endl;
    
    cout << "Pila tras pop: ";
    temp = st;
    elements.clear();
    while (!temp.empty()) {
        elements.push_back(temp.top());
        temp.pop();
    }
    reverse(elements.begin(), elements.end());
    for (const auto& elem : elements) {
        cout << elem << " ";
    }
    cout << endl;    
    return 0;
}
