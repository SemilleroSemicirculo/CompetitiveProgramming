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
	int tt = 1;
	while(true){
		ll n; cin >> n;
		if(n == 0) break;
		
		map<ll, queue<ll>*> TeamQueue;
		queue<queue<ll>*> Queue;

		for(int i = 0; i < n; i++){
			ll k; cin >> k;
			queue<ll>* team = new queue<ll>();
			for(int j = 0; j < k; j++){
				ll x; cin >> x;
				TeamQueue[x] = team;
			}
		}

		cout << "Scenario #" << tt << endl;
		while (true)
		{
			string s; cin >> s;
			if(s == "STOP") break;
			else if(s == "ENQUEUE"){
				ll x; cin >> x;
				TeamQueue[x]->push(x);
				if(TeamQueue[x]->size() == 1){
					Queue.push(TeamQueue[x]);
				}
			}
			else{
				ll x = Queue.front()->front();
				cout << x << endl;
				Queue.front()->pop();

				if(Queue.front()->size() == 0) Queue.pop();
			}
		}
		tt++; cout << endl;
	}
}