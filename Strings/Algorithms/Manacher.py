import sys

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Manacher (subcadena palíndroma más larga)
 * Problema  : CSES 1111 - Longest Palindrome (https://cses.fi/problemset/task/1111)
 * Entrada   : una cadena s
 * Salida    : la subcadena palíndroma más larga
 * Complejidad: tiempo O(n), memoria O(n)
"""


# d1 = radios de palíndromos impares, d2 = radios de los pares (centro entre dos letras)
def longest_palindrome(s):
    n = len(s)
    d1, d2 = [0] * n, [0] * n
    l, r = 0, -1
    for i in range(n):
        # se reutiliza el palíndromo simétrico dentro de [l, r]
        k = 1 if i > r else min(d1[l + r - i], r - i + 1)
        while i - k >= 0 and i + k < n and s[i - k] == s[i + k]:
            k += 1
        d1[i] = k
        k -= 1
        if i + k > r:
            l, r = i - k, i + k
    l, r = 0, -1
    for i in range(n):
        k = 0 if i > r else min(d2[l + r - i + 1], r - i + 1)
        while i - k - 1 >= 0 and i + k < n and s[i - k - 1] == s[i + k]:
            k += 1
        d2[i] = k
        k -= 1
        if i + k > r:
            l, r = i - k - 1, i + k

    # se elige el más largo entre impares y pares
    best = start = 0
    for i in range(n):
        if 2 * d1[i] - 1 > best:
            best, start = 2 * d1[i] - 1, i - d1[i] + 1
        if 2 * d2[i] > best:
            best, start = 2 * d2[i], i - d2[i]
    return s[start:start + best]


def main():
    print(longest_palindrome(input().strip()))


main()
