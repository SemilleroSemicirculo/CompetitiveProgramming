import sys
input = sys.stdin.readline

MOD = 10**9 + 7
MAXN = 1000001

# a^b mod MOD en O(log b) (pow de Python ya lo hace)
def binpow(a, b):
    return pow(a, b, MOD)

# inverso modular (MOD debe ser primo)
def mod_inv(a):
    return pow(a, MOD - 2, MOD)

fact = [1] * MAXN
for i in range(1, MAXN):
    fact[i] = fact[i - 1] * i % MOD
inv_fact = [1] * MAXN
inv_fact[MAXN - 1] = mod_inv(fact[MAXN - 1])
for i in range(MAXN - 1, 0, -1):
    inv_fact[i - 1] = inv_fact[i] * i % MOD

# C(n, k) mod MOD
def nCr(n, k):
    if k < 0 or k > n:
        return 0
    return fact[n] * inv_fact[k] % MOD * inv_fact[n - k] % MOD

t = int(input())
for _ in range(t):
    a, b = map(int, input().split())
    print(nCr(a, b))
