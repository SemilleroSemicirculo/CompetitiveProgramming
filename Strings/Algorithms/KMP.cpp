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

vector<int> KMP(string s){
    vector<int> LP = vector(s.size(), 0);
    for(int i = 1; i < s.size(); i++){
        int j = LP[i-1];
        while(j > 0 and s[i] != s[j]){
            j = LP[j-1];
        }
        if(s[i] == s[j]){
            j++;
        }
        LP[i] = j;
    }
    return LP;
}

vector<int> PatternSearch(string s, string t){
    vector<int> pos;
    
    vector<int> freq = KMP(t + '#' + s);
    for(int i = t.size()+1; i < freq.size(); i++){
        if(freq[i] == t.size()){
            pos.push_back(i - t.size() - t.size());
        }
    }
    
    for(int i = 0; i < pos.size(); i++){
        cout << i << " " << pos[i] << endl;
    }
    
    return pos;
}



int main() 
{
    string s = "abcdjklmabcabcxy";
    string t = "abc";
    PatternSearch(s, t);
}