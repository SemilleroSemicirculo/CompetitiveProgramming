#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
typedef long double ld;
const ll INF = numeric_limits<ll>::max();
#define all(x) x.begin(), x.end()
#define rall(x) x.rbegin(), x.rend()
#define MOD 1000000007
#define pi acos(-1)
#define gcd __gcd
#define lcm(a, b) ((a) * (b) / gcd(a, b))
#define precision(n) cout   << fixed << setprecision(n)
#define debug(arr) cerr << #arr << " = "; for (auto &x : arr) cerr << x << " "; cerr << endl;
#define fastio ios::sync_with_stdio(0); cin.tie(0); cout.tie(0);

ll mod(ll x, ll n){
    return (x % n + n) % n;
}

int main(){
    fastio;

    ll n; cin >> n;
    vector<pair<ll, ll>> points(n);
    for(int i = 0; i < n; i++){
        cin >> points[i].first >> points[i].second;
    }

    ll res = 0;
    for(int i = 0; i < n; i++){
        res += points[i].first * (points[mod(i + 1, n)].second - points[mod(i - 1, n)].second);
    }

    res = abs(res);
    cout << res << endl;
}
