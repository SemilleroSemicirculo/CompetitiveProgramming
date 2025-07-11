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
#define fastio ios::sync_with_stdio(0); cin.tie(0); cout.tie(0);#include <bits/stdc++.h>


struct Data{
    ll suma, size;
    Data(): suma(0), size(0) {}
    Data(ll s): suma(s), size(1) {}

    Data(const Data &left, const Data &right){
        suma = (left.suma + right.suma) % MOD;
        size = left.size + right.size;
    }

    void merge(const Data &left, const Data &right){
        *this = Data(left, right);
    }
};


struct Lazy{
    ll suma;
    Lazy(): suma(0) {}
    Lazy(ll s): suma(s) {}

    void updateData(Data &data){
        data.suma = (data.suma + (suma*data.size)) % MOD;
    }

    pair<Lazy, Lazy> split(ll left, ll right) const {
        return {*this, *this};
    }

    void updateLazy(const Lazy &newLazy){
        suma += newLazy.suma;
    }
};


struct SegmentTree{
    struct Node{
        Data data;
        Lazy lazy;
        bool has_lazy = false;
 
        Node(){data=Data(); lazy=Lazy(); has_lazy = false;}
        Node(ll s){data = Data(s); lazy=Lazy(); has_lazy = false;}
    };
    
    vector<Node> st;
    ll n;
 
    void build(vector<ll> &A, ll index, ll left, ll right){
        if(index == 1) {
            n = A.size();
            st.assign(4*n, Node());
        }
        if(left == right) st[index] = Node(A[left-1]);
        else{
            ll mid = (left + right)/2;
            build(A, 2*index, left, mid);
            build(A, 2*index+1, mid+1, right);
            st[index].data.merge(st[2*index].data, st[2*index+1].data);
        }
    }
 
    void propagate(ll index, ll left, ll right) {
        if (!st[index].has_lazy) return;
        
        st[index].lazy.updateData(st[index].data);
        if (left != right) {
            auto [lazyL, lazyR] = st[index].lazy.split(left, right);
            st[2*index].lazy.updateLazy(lazyL); st[2*index].has_lazy = true;
            st[2*index+1].lazy.updateLazy(lazyR); st[2*index+1].has_lazy = true;
        }
        
        st[index].lazy = Lazy();
        st[index].has_lazy = false;
    }
 
    void update(ll index, ll left, ll right, ll lower, ll upper, ll value){
        propagate(index, left, right);
        if(left > right || left > upper || right < lower) return;
        
        if(lower <= left && right <= upper){
            Lazy lazy = Lazy(value);
            st[index].lazy.updateLazy(lazy); st[index].has_lazy = true;
            propagate(index, left, right);
            return;
        }
        
        ll mid = left + (right - left)/2;
        update(2*index, left, mid, lower, upper, value);
        update(2*index+1, mid+1, right, lower, upper, value);
        
        st[index].data.merge(st[2*index].data, st[2*index+1].data);
    }
 
    Data query(ll index, ll left, ll right, ll lower, ll upper){
        propagate(index, left, right);
        if(left > right || left > upper || right < lower) return Data();
        if(lower <= left && right <= upper){
            return st[index].data;
        }
        ll mid = (left + right)/2;
        Data res;
        res.merge(
            query(2*index, left, mid, lower, upper),
            query(2*index+1, mid+1, right, lower, upper)
        );
        return res;
    }
};


int main() {
    ll n, q; cin >> n >> q;
    vector<ll> a(n); for(auto &x: a){cin >> x;}

    SegmentTree Tree;
    Tree.build(a, 1, 1, n);

    for(int i = 0; i < q; i++){
        ll type; cin >> type;
        ll l, r; cin >> l >> r;
        
        if(type == 1) cout << Tree.query(1, 1, n, l, r).suma << endl;
        else{
            ll value; cin >> value;
            Tree.update(1, 1, n, l, r, value);
        } 
    }
}