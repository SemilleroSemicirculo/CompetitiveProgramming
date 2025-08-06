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
    vector<int> LP(s.size(), 0);
    for(int i = 1; i < s.size(); i++){
        int j = LP[i-1];
        while(j > 0 && s[i] != s[j]) j = LP[j-1];
        if(s[i] == s[j]) j++;
        LP[i] = j;
    }
    return LP;
}

vector<int> PatternSearch(string s, string t){
    vector<int> pos;
    string combined = t + '#' + s;
    vector<int> lps = KMP(combined);
    
    for(int i = t.size() + 1; i < lps.size(); i++){
        if(lps[i] == t.size()){
            pos.push_back(i - t.size() - t.size());
        }
    }
    
    return pos;
}

int main(){
    fastio;
    
    string s = "abcdjklmabcabcxy";
    string t = "abc";
    
    cout << "=== Original Example ===" << endl;
    vector<int> positions = PatternSearch(s, t);
    
    cout << "Pattern '" << t << "' found in '" << s << "' at indices:" << endl;
    for(int i = 0; i < positions.size(); i++){
        cout << "Match " << i + 1 << ": starts at index " << positions[i] << endl;
    }
    
    return 0;
}