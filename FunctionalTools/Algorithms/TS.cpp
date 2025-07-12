#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef long double ld;
const ll INF = numeric_limits<ll>::max();

#define all(x) x.begin(), x.end()
#define fastio ios::sync_with_stdio(0); cin.tie(0); cout.tie(0);

// asume f es unimodal (primero crece luego decrece) en [l..r]
ll ternary_search(int l, int r, function<ll(int)> f) {
    while (r - l > 3) {
        int m1 = l + (r - l) / 3;
        int m2 = r - (r - l) / 3;
        if (f(m1) < f(m2))
            l = m1;
        else
            r = m2;
    }
    ll best = f(l);
    for (int i = l+1; i <= r; i++)
        best = max(best, f(i));
    return best;
}

int main() {
    fastio;
    int L, R;
    cin >> L >> R;
    // ejemplo: f(x) = -(x-3)^2 + 10  (unimodal)
    auto f = [&](int x){ return -(ll)(x-3)*(x-3) + 10; };
    ll ans = ternary_search(L, R, f);
    cout << ans << "\n";
    return 0;
}
