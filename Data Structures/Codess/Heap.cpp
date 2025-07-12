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

class Compare {
public:
    // Retorna True si el orden NO es correcto
    bool operator()(int a, int b){
        return a < b;
    }
};

int main(){
    fastio;
    
    // --- Minheap ---
    priority_queue<int, vector<int>, greater<int>> minheap;
    vector<int> data = {5, 3, 8, 1, 7};
    
    for (int x : data) {
        minheap.push(x);
    }
    
    cout << "Minheap: ";
    priority_queue<int, vector<int>, greater<int>> temp_min = minheap;
    while (!temp_min.empty()) {
        cout << temp_min.top() << " ";
        temp_min.pop();
    }
    cout << endl;
    
    int min_val = minheap.top();
    minheap.pop();
    cout << "Elemento mínimo extraído: " << min_val << endl;
    
    // --- Maxheap ---
    priority_queue<int> maxheap;
    
    for (int x : data) {
        maxheap.push(x);
    }
    
    cout << "Maxheap: ";
    priority_queue<int> temp_max = maxheap;
    while (!temp_max.empty()) {
        cout << temp_max.top() << " ";
        temp_max.pop();
    }
    cout << endl;
    
    int max_val = maxheap.top();
    maxheap.pop();
    cout << "Elemento máximo extraído: " << max_val << endl;
    
    return 0;
}
