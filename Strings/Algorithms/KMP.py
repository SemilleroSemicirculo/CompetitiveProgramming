def KMP(s):
    n = len(s)
    LP = [0] * n  # LPS (Longest Proper Prefix which is also Suffix) array
    # LP[0] is always 0 as a single character has no proper prefix or suffix
    for i in range(1, n):
        # j represents the length of the previous longest prefix-suffix
        j = LP[i-1]        
        # If characters don't match, use the LPS array to find the next position to compare
        while j > 0 and s[i] != s[j]:
            j = LP[j-1]
        # If characters match, increment the length of current prefix-suffix
        if s[i] == s[j]:
            j += 1
        LP[i] = j
    
    return LP


def pattern_search(text, pattern):
    positions = []
    
    # Create combined string: pattern + separator + text
    # The '#' separator ensures that pattern cannot match across the boundary
    combined = pattern + '#' + text
    
    # Compute LPS array for the combined string
    lps = KMP(combined)
    
    # Check positions in the text part of the combined string
    pattern_len = len(pattern)
    for i in range(pattern_len + 1, len(lps)):
        # If LPS value equals pattern length, we found a complete match
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
