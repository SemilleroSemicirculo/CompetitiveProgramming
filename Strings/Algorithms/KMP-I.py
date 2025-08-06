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
    positions = []
    combined = pattern + '#' + text
    
    lps = KMP(combined)
    
    pattern_len = len(pattern)
    for i in range(pattern_len + 1, len(lps)):
        if lps[i] == pattern_len:
            text_position = i - pattern_len - pattern_len
            positions.append(text_position)
    
    for i, pos in enumerate(positions):
        print(f"{i} {pos}")
    
    return positions


s = "abcdjklmabcabcxy"
t = "abc"
print("=== Original Example ===")
pattern_search(s, t)
