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


struct Data{
    ll maximo, size, index;
    Data(){maximo = 0; size=0; index=1;}
    Data(ll s, ll ind){maximo = s; size = 1; ind=index;}

    Data(const Data &left, const Data &right){
        if(left.maximo >= right.maximo){
            maximo = left.maximo;
            index = left.index;
        }
        else{
            maximo = right.maximo;
            index = right.index;
        }
        size = left.size + right.size;
    }

    void merge(const Data &left, const Data &right){
        *this = Data(left, right);
    }
};


struct SegmentTree{
    struct Node{
        Data data;

        Node(){data=Data();}
        Node(ll s, ll ind){data = Data(s, ind);}
    };
    
    vector<Node> st;
    ll n;

    void build(vector<ll> &A, ll index, ll left, ll right){
        if(index == 1) {
            n = A.size();
            st.assign(4*n, Node());
        }
        if(left == right) st[index] = Node(A[left-1], left);
        else{
            ll mid = (left + right)/2;
            build(A, 2*index, left, mid);
            build(A, 2*index+1, mid+1, right);
            st[index].data.merge(st[2*index].data, st[2*index+1].data);
        }
    }
    // Query range [lower, upper]
    Data query(ll index, ll left, ll right, ll lower, ll upper){
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
    ll n, m; cin >> n >> m;
    vector<ll> h(n); for(auto &x: h){cin >> x;}

    SegmentTree Tree;
    Tree.build(h, 1, 1, n);
    
}