def KMP(s):
    n = len(s)
    LP = [0 for i in range(n)]
    for i in range(1, n):
        j = LP[i-1]        
        while j > 0 and s[i] != s[j]:
            j = LP[j-1]
        if s[i] == s[j]:
            j += 1
        LP[i] = j
    
    return LP


def pattern_search(text, pattern):
    lp = KMP(pattern)
    result = []
    j = 0
    for i in range(len(text)):
        while(j > 0 and text[i] != pattern[j]):
            j = lp[j-1]
        if(text[i] == pattern[j]):
            j += 1
        if(j == len(pattern)):
            result.append(i - len(pattern) + 1)
            j = lp[j-1]
    return result

s = "abcdjklmabcabcxy"
t = "abc"
print("=== Original Example ===")
positions = pattern_search(s, t)
print(f"Pattern '{t}' found in '{s}' at indices: {positions}")
