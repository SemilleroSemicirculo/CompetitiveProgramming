#include <bits/stdc++.h>
#include <iomanip>

using namespace std;

typedef long long int ll;
typedef pair<ll, ll> pll;
typedef tuple<ll, ll, ll> triple;
const ll INF = numeric_limits<ll>::max();

template <typename ele_type>
ostream& operator<<(ostream& os, const vector<ele_type>& vect_name){
  for(auto itr: vect_name){
    os << itr << " ";
  }
  return os;
}

ll MOD = pow(10, 9)+9;
ll Max_n = pow(10, 6);
ll mod(ll x, ll n){
    if(x >= 0) return x % n;
    else return n - (-x % n);
}

vector<ll> Fib(Max_n, 0);
vector<ll> Fib_suma(Max_n, 0);


struct Data{
    ll suma, size = 0;
    Data(){suma = 0;}
    Data(ll s){suma = s; size = 1;}

    Data(const Data &left, const Data &right){
        suma = mod(left.suma + right.suma, MOD);
        size = left.size + right.size;
    }

    void merge(const Data &left, const Data &right){
        *this = Data(left, right);
    }
};


struct Lazy{
    ll suma, lower;
    Lazy(){suma = 0, lower = 1;}
    Lazy(ll s, ll lw){suma = s; lower = lw;}

    void updateData(Data &data){
        data.suma = mod(data.suma + suma, MOD);
    }

    pair<Lazy, Lazy> split(ll left, ll right) const {
        ll mid = (left + right)/2;
        ll suma1 = mod(Fib_suma[max(mid-lower+1, 0ll)] - Fib_suma[max(left-lower, 0ll)], MOD);
        ll suma2 = mod(Fib_suma[max(right-lower+1, 0ll)] - Fib_suma[max(mid - lower+1, 0ll)], MOD);
        return {
            Lazy(suma1, lower), 
            Lazy(suma2, lower)
        };
    }

    void updateLazy(const Lazy &newLazy){
        suma = mod(suma + newLazy.suma, MOD);
        // lower = newLazy.lower;
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

    // Propagate lazy value to children and update current node's data
    void propagate(ll index, ll left, ll right, ll lower) {
        if (!st[index].has_lazy) return;

        st[index].lazy.updateData(st[index].data);
        
        if (left != right) {
            ll mid = (left + right) / 2;
            auto [lazyL, lazyR] = st[index].lazy.split(left, right);

            st[2*index].lazy.updateLazy(lazyL); st[2*index].has_lazy = true;
            st[2*index+1].lazy.updateLazy(lazyR); st[2*index+1].has_lazy = true;
        }
        st[index].lazy = Lazy();
        st[index].has_lazy = false;
    }

    // Update range [lower, upper] with 'lazy'
    void update(ll index, ll left, ll right, ll lower, ll upper, const Lazy &lazy){
        vector<ll> test = {index, left, right, lower, upper, lazy.lower};

        propagate(index, left, right, lower);
        if(left > right || left > upper || right < lower) return;
        
        st[index].lazy.lower = lazy.lower;
        if(lower <= left && right <= upper){
            st[index].lazy.updateLazy(lazy);
            st[index].has_lazy = true;
            propagate(index, left, right, lower);
            return;
        }
        
        ll mid = (left + right)/2;
        auto [lazyL, lazyR] = st[index].lazy.split(left, right);
        update(2*index, left, mid, lower, upper, lazyL);
        update(2*index+1, mid+1, right, lower, upper, lazyR);
        st[index].data.merge(st[2*index].data, st[2*index+1].data);

    }

    // Query range [lower, upper]
    Data query(ll index, ll left, ll right, ll lower, ll upper){
        propagate(index, left, right, lower);
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

    Fib[1] = 1;
    Fib[2] = 1;
    for(int i = 3; i< Fib.size(); i++) Fib[i] = mod(Fib[i-1] + Fib[i-2], MOD);
    for(int i = 1; i< Fib_suma.size(); i++) Fib_suma[i] = mod(Fib_suma[i-1] + Fib[i], MOD);

    for(int i = 0; i < q; i++){
        ll type; cin >> type;
        ll l, r; cin >> l >> r;

        ll F = Fib_suma[r-l+1];
        
        
        if(type == 1) Tree.update(1, 1, n, l, r, Lazy(F, l));
        else cout << Tree.query(1, 1, n, l, r).suma << endl;
    }
}