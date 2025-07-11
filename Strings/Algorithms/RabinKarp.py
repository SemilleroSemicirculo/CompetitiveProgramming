max_size=100003

P1 = 10**9 + 7
P2 = 3245284303

base = 60
pot1 = [1] * max_size
pot2 = [1] * max_size
for i in range(1, max_size):
    pot1[i] = (base * pot1[i-1]) % P1
    pot2[i] = (base * pot2[i-1]) % P2
    
def code(char):
    return ord(char) - ord('A') + 1


class Hash:
    """Hash structure with double hashing support."""
    def __init__(self, h1=0, h2=0, size=0):
        self.hash_1 = h1
        self.hash_2 = h2
        self.size = size
    
    @classmethod
    def from_char(cls, char):
        """Create hash from single character"""
        code_val = code(char)
        return cls(code_val, code_val, 1)
    
    def __add__(self, other):
        """Concatenate two hashes"""
        new_h1 = (self.hash_1 * pot1[other.size] + other.hash_1) % P1
        new_h2 = (self.hash_2 * pot1[other.size] + other.hash_2) % P2
        return Hash(new_h1, new_h2, self.size + other.size)
    
    def __sub__(self, other):
        """Remove prefix hash from current hash"""
        new_h1 = (self.hash_1 - other.hash_1 * pot1[self.size - other.size]) % P1
        new_h2 = (self.hash_2 - other.hash_2 * pot1[self.size - other.size]) % P2
        return Hash(new_h1, new_h2, self.size - other.size)
    
    def __eq__(self, other):
        """Check if two hashes are equal"""
        return self.hash_1 == other.hash_1 and self.hash_2 == other.hash_2


def pattern_search(text, pattern):
    """
    Find all occurrences of pattern in text using Rabin-Karp algorithm.
    Returns list of 1-indexed positions.
    """
    if len(pattern) > len(text):
        return []
    
    
    # Build prefix hash array for text
    text_hashes = []
    text_hashes.append(Hash.from_char(text[0]))
    
    for i in range(1, len(text)):
        text_hashes.append(text_hashes[-1] + Hash.from_char(text[i]))
    
    # Compute pattern hash
    pattern_hash = Hash(0, 0, 0)
    for char in pattern:
        pattern_hash = pattern_hash + Hash.from_char(char)
    
    # Search for pattern
    results = []
    pattern_len = len(pattern)
    
    for i in range(len(text) - pattern_len + 1):
        # Extract substring hash
        if i == 0:
            substring_hash = text_hashes[pattern_len - 1]
        else:
            substring_hash = text_hashes[i + pattern_len - 1] - text_hashes[i - 1]
        
        # Check if hashes match
        if substring_hash == pattern_hash:
            results.append(i + 1)  # 1-indexed position
    
    return results



t = int(input())

for _ in range(t):
    s1, s2 = input().split()
    
    if len(s2) > len(s1):
        print("Not Found")
        continue
    
    results = pattern_search(s1, s2)
    
    if not results:
        print("Not Found")
    else:
        print(len(results))
        print(*results)