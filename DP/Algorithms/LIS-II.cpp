#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef long double ld;
const ll INF = numeric_limits<ll>::max();

#define all(x) x.begin(), x.end()
#define rall(x) x.rbegin(), x.rend()
#define MOD 998244353;
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
    
    ll n; cin >> n;
    vector<ll> a(n); for(auto &x: a) cin >> x;


    vector<ll> R;
    vector<ll> M;

    for(int i = 0; i < n; ++i) {
        auto it = lower_bound(all(R), a[i]);
        ll ind = it - R.begin();

        if (ind == R.size()) {
            R.push_back(a[i]);
            M.push_back(i);
        } 
        else {
            R[ind] = a[i];
            M[ind] = i;
        }
    }

    cout << R.size() << endl;
    
}