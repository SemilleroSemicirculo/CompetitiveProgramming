class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end_of_word = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        current = self.root
        for char in word:
            if char not in current.children:
                current.children[char] = TrieNode()
            current = current.children[char]
        current.is_end_of_word = True

    def search(self, word):
        current = self.root
        for char in word:
            if char not in current.children:
                return False
            current = current.children[char]
        return current.is_end_of_word

    def startsWith(self, prefix):
        current = self.root
        for char in prefix:
            if char not in current.children:
                return False
            current = current.children[char]
        return True

prefix_trie = Trie()

prefix_trie.insert("apple")
print(f"Search 'apple': {prefix_trie.search('apple')}")      # Expected: True
print(f"Search 'app': {prefix_trie.search('app')}")          # Expected: False
print(f"Starts with 'app': {prefix_trie.startsWith('app')}")  # Expected: True

prefix_trie.insert("app")
print(f"Search 'app' after insert: {prefix_trie.search('app')}")