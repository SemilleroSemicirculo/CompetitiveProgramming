#include <bits/stdc++.h>
using namespace std;
#define fastio ios::sync_with_stdio(0); cin.tie(0); cout.tie(0);
typedef long long int ll;

template <typename ele_type>
ostream& operator<<(ostream& os, const vector<ele_type>& vect_name){
  for(auto itr: vect_name){
    os << itr << " ";
  }
  return os;
}


ll P1 = pow(10, 9)+7;
ll P2 = 3245284303;
ll base = 60;

vector<ll> Pot1(pow(10, 5)+3, 1);
vector<ll> Pot2(pow(10, 5)+3, 1);

ll code(char &a){
  return (ll)a - (ll)'A' + 1;
}

ll mod(ll x, ll n){
  if(x > 0) return x % n;
  else return n - (-x % n);
}

struct Hash{
    ll hash_1, hash_2, size;

    Hash () {hash_1 = 0, hash_2 = 0, size=0;}
    Hash(ll h1, ll h2, ll s){hash_1=h1; hash_2=h2; size=s;}
    Hash(char s){hash_1 = code(s), hash_2 = code(s), size=1;}
    
    Hash operator+(const Hash &other){ return Hash(
      mod(hash_1*Pot1[other.size] + other.hash_1, P1) , 
      mod(hash_2*Pot2[other.size] + other.hash_2, P2) ,
      size + other.size);}

    Hash operator-(const Hash &other){ return Hash(
      mod(hash_1 - other.hash_1*Pot1[size - other.size], P1), 
      mod(hash_2 - other.hash_2*Pot2[size - other.size], P2),
      size - other.size);}

    bool operator==(const Hash &other){return hash_1 == other.hash_1 && hash_2 == other.hash_2;}
};

int main()
{ 
    fastio;
    
    for(int i = 1; i < Pot1.size(); i++){
      Pot1[i] = (base * Pot1[i-1]) % P1;
      Pot2[i] = (base * Pot2[i-1]) % P2;
    }

    int t; cin >> t;
    while (t--)
    {
      string s1, s2; cin >> s1 >> s2;
      if(s2.size() > s1.size()){ cout << "Not Found" << endl; continue;}
      
      vector<Hash> text;
      text.push_back(Hash(s1.front()));
      for(int i = 1; i < s1.size(); i++){
        text.push_back(text.back() + Hash(s1[i]));
      }

      Hash pattern;
      for(auto c: s2) pattern = pattern + Hash(c);
      
      vector<ll> res;
      for(int i = 0; i <= s1.size() - s2.size(); i++){
        Hash search;
        if(i == 0) search = text[s2.size()-1];
        else search = text[i+s2.size()-1] - text[i-1];
  
        if(search == pattern) res.push_back(i+1); 
      }

      if(res.empty()) cout << "Not Found" << endl;
      else{
        cout << res.size() << endl;
        cout << res << endl;
      }
      cout << endl;
    }
}