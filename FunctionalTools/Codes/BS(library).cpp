#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef long double ld;
const ll INF = numeric_limits<ll>::max();

#define all(x) x.begin(), x.end()
#define fastio ios::sync_with_stdio(0); cin.tie(0); cout.tie(0);

int main() {
    fastio;
    int n; ll target;
    cin >> n >> target;
    vector<ll> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];
    // asume a[] ordenado
    bool found = binary_search(all(a), target);
    if (found) {
        cout << "FOUND\n";
        // posición con lower_bound:
        int idx = int(lower_bound(all(a), target) - a.begin());
        cout << "at index " << idx << "\n";
    } else {
        cout << "NOT FOUND\n";
    }
    return 0;
}
