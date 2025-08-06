import sys
input = sys.stdin.readline

# Criba de Eratóstenes: devuelve lista booleana de primos hasta N
def sieve(N):
    is_prime = [True] * (N+1)
    is_prime[0:2] = [False, False]
    p = 2
    while p*p <= N:
        if is_prime[p]:
            for x in range(p*p, N+1, p):
                is_prime[x] = False
        p += 1
    return is_prime

# Criba segmentada: devuelve lista de primos en [L..R]
def segmented_sieve(L, R):
    import math
    lim = int(math.isqrt(R))
    base = sieve(lim)
    primes = [i for i, ok in enumerate(base) if ok]
    sz = R - L + 1
    is_prime = [True] * sz
    if L == 0:
        if sz > 0: is_prime[0] = False
        if sz > 1: is_prime[1] = False
    for p in primes:
        start = max(p*p, ((L + p - 1)//p)*p)
        for x in range(start, R+1, p):
            is_prime[x - L] = False
    return [L + i for i, ok in enumerate(is_prime) if ok]

# Ejemplo de uso:
# lectura y criba clásica
N = int(input())
small = sieve(N)
print(*[i for i in range(2, N+1) if small[i]])

# lectura y criba segmentada
L, R = map(int, input().split())
seg = segmented_sieve(L, R)
print(*seg)
