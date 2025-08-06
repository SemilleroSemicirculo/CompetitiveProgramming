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

struct Node{
    int children[26];
    bool flag = false; 

    Node(){
        fill(begin(children), end(children), -1);
    }
};

struct Trie {
    vector<Node> Tree;
    Trie() {
        Tree.emplace_back();
    }
    
    void insert(string word) {
        int v = 0;
        for(int i = 0; i < word.size(); i++){
            int code = word[i] - 'a';
            if(Tree[v].children[code] == -1){
                Tree[v].children[code] = Tree.size();
                Tree.emplace_back();
            }
            v = Tree[v].children[code];   
        }
        Tree[v].flag = true;
    }
    
    bool search(string word) {
      int v = 0;
      for(int i = 0; i < word.size(); i++){
        int code = word[i] - 'a';
        if(Tree[v].children[code] == -1) return false;
        v = Tree[v].children[code];
      }
      return Tree[v].flag;
    }
    
    bool startsWith(string prefix) {
      int v = 0;
      for(int i = 0; i < prefix.size(); i++){
        int code = prefix[i] - 'a';
        if(Tree[v].children[code] == -1) return false;
        v = Tree[v].children[code];
      }
      return true;
    }
};

int main(){
    fastio;
    
    Trie PrefixTrie;
    PrefixTrie.insert("apple");
    cout << PrefixTrie.search("apple") << endl;
    cout << PrefixTrie.search("app") << endl;
    cout << PrefixTrie.startsWith("app") << endl;
    PrefixTrie.insert("app");
    cout << PrefixTrie.search("app") << endl;
}