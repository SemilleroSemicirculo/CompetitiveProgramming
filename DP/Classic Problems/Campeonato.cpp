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

int main() {
    fastio;
    
    double p = 0.3;
    double q = 1 - p;
    
    int n = 10;
    vector<vector<double>> P(n+1, vector<double>(n+1, 0.0));
    
    // Initialize base cases and fill first part of DP table
    for (int i = 1; i <= n; i++) {
        P[0][i] = 1.0;  // If we need 0 more wins, probability is 1
        P[i][0] = 0.0;  // If opponent needs 0 more wins, our probability is 0
        
        for (int j = 1; j < i; j++) {
            P[j][i-j] = p * P[j-1][i-j] + q * P[j][i-j-1];
        }
    }
    
    // Fill remaining part of DP table
    for (int i = 1; i <= n; i++) {
        for (int j = 0; j <= n-i; j++) {
            P[i+j][n-j] = p * P[i+j-1][n-j] + q * P[i+j][n-j-1];
        }
    }
    
    // Output the result with high precision
    precision(10);
    cout << P[n][n] << endl;
    
    // Optional: Display the DP table for debugging
    cout << "\nDP Table P[i][j] (i wins needed, j opponent wins needed):" << endl;
    for (int i = 0; i <= n; i++) {
        for (int j = 0; j <= n; j++) {
            cout << fixed << setprecision(3) << P[i][j] << " ";
        }
        cout << endl;
    }
    
    return 0;
}
