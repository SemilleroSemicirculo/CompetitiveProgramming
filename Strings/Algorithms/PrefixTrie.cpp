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
 * Algoritmo : Trie (prefix tree) + DP de conteo de formas
 * Problema  : CSES 1731 - Word Combinations (https://cses.fi/problemset/task/1731)
 * Entrada   : cadena s, k, luego k palabras
 * Salida    : cantidad de formas de construir s con las palabras, módulo 10^9+7
 * Complejidad: tiempo O(|s|^2 + suma de longitudes), memoria O(suma de longitudes)
 */

const int MODW = 1000000007;  // este problema pide módulo 10^9+7

struct Node {
    int children[26];
    bool flag = false;

    Node() {
        fill(begin(children), end(children), -1);
    }
};

struct Trie {
    vector<Node> Tree;
    Trie() {
        Tree.emplace_back();
    }

    void insert(const string &word) {
        int v = 0;
        for (char ch : word) {
            int code = ch - 'a';
            if (Tree[v].children[code] == -1) {
                Tree[v].children[code] = Tree.size();
                Tree.emplace_back();
            }
            v = Tree[v].children[code];
        }
        Tree[v].flag = true;
    }

    bool search(const string &word) {
        int v = 0;
        for (char ch : word) {
            int code = ch - 'a';
            if (Tree[v].children[code] == -1) return false;
            v = Tree[v].children[code];
        }
        return Tree[v].flag;
    }

    bool startsWith(const string &prefix) {
        int v = 0;
        for (char ch : prefix) {
            int code = ch - 'a';
            if (Tree[v].children[code] == -1) return false;
            v = Tree[v].children[code];
        }
        return true;
    }
};

int main() {
    fastio;
    string s;
    int k;
    cin >> s >> k;
    Trie PrefixTrie;
    for (int i = 0; i < k; i++) {
        string w;
        cin >> w;
        PrefixTrie.insert(w);
    }

    // dp[i] = formas de construir el sufijo s[i..]
    int n = s.size();
    vector<ll> dp(n + 1, 0);
    dp[n] = 1;
    for (int i = n - 1; i >= 0; i--) {
        int v = 0;
        for (int j = i; j < n; j++) {
            int code = s[j] - 'a';
            if (PrefixTrie.Tree[v].children[code] == -1) break;
            v = PrefixTrie.Tree[v].children[code];
            if (PrefixTrie.Tree[v].flag) dp[i] = (dp[i] + dp[j + 1]) % MODW;
        }
    }
    cout << dp[0] << "\n";
    return 0;
}
