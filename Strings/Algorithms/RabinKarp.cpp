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
 * Algoritmo : Rabin-Karp con doble hash polinomial
 * Problema  : CSES 1753 - String Matching (https://cses.fi/problemset/task/1753)
 * Entrada   : texto s y luego patrón t (letras minúsculas)
 * Salida    : cantidad de apariciones de t en s
 * Complejidad: tiempo O(|s| + |t|) esperado, memoria O(|s|)
 */

ll P1 = 1000000007;
ll P2 = 998244353;
ll base = 60;

vector<ll> Pot1(1000003, 1);
vector<ll> Pot2(1000003, 1);

ll code(char a) {
    return (ll)a - (ll)'a' + 1;
}

ll mod(ll x, ll n) {
    return (x % n + n) % n;
}

struct Hash {
    ll hash_1, hash_2, size;

    Hash() { hash_1 = 0, hash_2 = 0, size = 0; }
    Hash(ll h1, ll h2, ll s) { hash_1 = h1; hash_2 = h2; size = s; }
    Hash(char s) { hash_1 = code(s), hash_2 = code(s), size = 1; }

    Hash operator+(const Hash &other) const {
        return Hash(mod(hash_1 * Pot1[other.size] + other.hash_1, P1),
                    mod(hash_2 * Pot2[other.size] + other.hash_2, P2),
                    size + other.size);
    }

    Hash operator-(const Hash &other) const {
        return Hash(mod(hash_1 - other.hash_1 * Pot1[size - other.size], P1),
                    mod(hash_2 - other.hash_2 * Pot2[size - other.size], P2),
                    size - other.size);
    }

    bool operator==(const Hash &other) const {
        return hash_1 == other.hash_1 && hash_2 == other.hash_2;
    }
};

int main() {
    fastio;
    for (int i = 1; i < (int)Pot1.size(); i++) {
        Pot1[i] = (base * Pot1[i - 1]) % P1;
        Pot2[i] = (base * Pot2[i - 1]) % P2;
    }

    string s1, s2;
    cin >> s1 >> s2;
    if (s2.size() > s1.size()) {
        cout << 0 << "\n";
        return 0;
    }

    // text[i] = hash del prefijo s1[0..i]
    vector<Hash> text;
    text.push_back(Hash(s1.front()));
    for (int i = 1; i < (int)s1.size(); i++)
        text.push_back(text.back() + Hash(s1[i]));

    Hash pattern;
    for (auto c : s2) pattern = pattern + Hash(c);

    int count = 0;
    for (int i = 0; i + s2.size() <= s1.size(); i++) {
        Hash search;
        if (i == 0) search = text[s2.size() - 1];
        else search = text[i + s2.size() - 1] - text[i - 1];
        if (search == pattern) count++;
    }
    cout << count << "\n";
    return 0;
}
