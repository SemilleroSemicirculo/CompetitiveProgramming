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

class comp{
	public:
		bool operator()(tuple<ll, ll, ll>& a, tuple<ll, ll, ll>&b){
			return get<0>(a) > get<0>(b);
		}
};

vector<ll> merge(vector<ll> &a, vector<ll> &b, int k){
	vector<ll> res(k);

	priority_queue<tuple<ll, ll, ll>, vector<tuple<ll, ll, ll>>, comp> heap;
	ll suma, ii, j;
	set<tuple<ll, ll>> vis;
	heap.push({a[0] + b[0], 0, 0});
	for(int i = 0; i < k; i++){
		auto [suma, ii, j] = heap.top(); heap.pop();
		res[i] = suma;
		
		if(vis.find({ii+1, j}) == vis.end()){
			tuple<ll, ll, ll> first = {a[ii+1] + b[j], ii+1, j};
			heap.push(first);
			vis.insert({ii+1, j});
		}
		if(vis.find({ii, j+1}) == vis.end()){
			tuple<ll, ll, ll> second = {a[ii] + b[j+1], ii, j+1};
			heap.push(second);
			vis.insert({ii, j+1});
		}

	}
	return res;
}
 
int main(){
	int k; 
	while(scanf("%d", &k) != EOF){
		vector<ll> res(k); for(auto&x:res){cin >> x;}
		sort(res.begin(), res.end());
		for(int i = 1; i < k; i++){
			vector<ll> a(k); for(auto&x:a){cin >> x;} sort(a.begin(), a.end());
			res = merge(res, a, k); sort(res.begin(), res.end());
		}
		for(int i = 0; i < k-1; i++) cout << res[i] << " ";
		cout << res.back() << endl;
	}
}