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
 * Algoritmo : K menores sumas con heap (fusión de dos listas ordenadas)
 * Problema  : UVa 11997 - K Smallest Sums
 * Entrada   : varios casos: k, luego k filas de k enteros
 * Salida    : las k menores sumas posibles (una por columna), por caso
 * Complejidad: tiempo O(k^2 log k), memoria O(k)
 */

// comparador para que el heap sea un min-heap por la suma
class comp{
	public:
		bool operator()(tuple<ll, ll, ll>& a, tuple<ll, ll, ll>&b){
			return get<0>(a) > get<0>(b);
		}
};

// mezcla dos listas ordenadas y devuelve las k menores sumas a[i] + b[j]
vector<ll> merge(vector<ll> &a, vector<ll> &b, int k){
	vector<ll> res(k);

	priority_queue<tuple<ll, ll, ll>, vector<tuple<ll, ll, ll>>, comp> heap;
	ll suma, ii, j;
	set<tuple<ll, ll>> vis;
	// la menor suma posible es a[0] + b[0]
	heap.push({a[0] + b[0], 0, 0});
	for(int i = 0; i < k; i++){
		// se saca la menor suma pendiente
		auto [suma, ii, j] = heap.top(); heap.pop();
		res[i] = suma;
		
		// se agregan los dos vecinos (i+1, j) y (i, j+1); vis evita repetirlos
		if(ii+1 < k && vis.find({ii+1, j}) == vis.end()){
			tuple<ll, ll, ll> first = {a[ii+1] + b[j], ii+1, j};
			heap.push(first);
			vis.insert({ii+1, j});
		}
		if(j+1 < k && vis.find({ii, j+1}) == vis.end()){
			tuple<ll, ll, ll> second = {a[ii] + b[j+1], ii, j+1};
			heap.push(second);
			vis.insert({ii, j+1});
		}

	}
	return res;
}
 
int main(){
	// varios casos: se mezcla fila por fila quedándose siempre con las k menores
	fastio;
	int k; 
	while(cin >> k){
		vector<ll> res(k); for(auto&x:res){cin >> x;}
		sort(res.begin(), res.end());
		for(int i = 1; i < k; i++){
			vector<ll> a(k); for(auto&x:a){cin >> x;} sort(a.begin(), a.end());
			res = merge(res, a, k); sort(res.begin(), res.end());
		}
		for(int i = 0; i < k-1; i++) cout << res[i] << " ";
		cout << res.back() << "\n";
	}
}
