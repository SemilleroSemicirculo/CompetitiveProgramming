class Data:
    """
    Data structure to store information for each node in the segment tree.
    In this case, we store the sum and size of the range.
    """
    def __init__(self, suma=0, size=0):
        self.suma = suma
        self.size = size
    
    @classmethod
    def from_value(cls, value):
        """Create a Data object from a single value (leaf node)"""
        return cls(value, 1)
    
    @classmethod
    def from_merge(cls, left, right):
        """Create a Data object by merging two child nodes"""
        MOD = 998244353
        suma = (left.suma + right.suma) % MOD
        size = left.size + right.size
        return cls(suma, size)
    
    def merge(self, left, right):
        """Merge two child nodes into this node"""
        merged = Data.from_merge(left, right)
        self.suma = merged.suma
        self.size = merged.size


class Lazy:
    """
    Lazy propagation structure for range updates.
    Stores the value to be added to all elements in a range.
    """
    def __init__(self, suma=0):
        self.suma = suma
    
    def update_data(self, data):
        """Apply this lazy update to a data node"""
        MOD = 998244353
        data.suma = (data.suma + (self.suma * data.size)) % MOD
    
    def split(self, left, right):
        """Split this lazy update for child nodes (in this case, both get the same update)"""
        return self, self
    
    def update_lazy(self, new_lazy):
        """Combine this lazy update with a new one"""
        self.suma += new_lazy.suma


class Node:
    """
    A single node in the segment tree containing data, lazy update, and lazy flag.
    """
    def __init__(self, value=None):
        if value is not None:
            self.data = Data.from_value(value)
        else:
            self.data = Data()
        self.lazy = Lazy()
        self.has_lazy = False


class SegmentTree:
    """
    Segment Tree with Lazy Propagation for range sum queries and range updates.
    
    This implementation supports:
    - Range sum queries: Get sum of elements from index l to r
    - Range updates: Add a value to all elements from index l to r
    
    Time Complexity:
    - Build: O(n)
    - Query: O(log n)
    - Update: O(log n)
    
    Space Complexity: O(4n)
    """
    
    def __init__(self):
        self.st = []  # Segment tree array
        self.n = 0    # Size of original array
    
    def build(self, A):
        """
        Build the segment tree from array A.
        
        Args:
            A: List of integers to build the tree from
        """
        self.n = len(A)
        self.st = [Node() for _ in range(4 * self.n)]
        self._build(A, 1, 1, self.n)
    
    def _build(self, A, index, left, right):
        """
        Recursive helper function to build the segment tree.
        
        Args:
            A: Original array
            index: Current node index in segment tree
            left, right: Range [left, right] that this node represents
        """
        if left == right:
            # Leaf node - store single element (convert to 0-indexed)
            self.st[index] = Node(A[left - 1])
        else:
            # Internal node - build children and merge
            mid = (left + right) // 2
            self._build(A, 2 * index, left, mid)
            self._build(A, 2 * index + 1, mid + 1, right)
            # Merge children data
            self.st[index].data.merge(self.st[2 * index].data, self.st[2 * index + 1].data)
    
    def propagate(self, index, left, right):
        """
        Apply lazy propagation to push updates down the tree.
        
        Args:
            index: Current node index
            left, right: Range this node represents
        """
        if not self.st[index].has_lazy:
            return
        
        # Apply lazy update to current node's data
        self.st[index].lazy.update_data(self.st[index].data)
        
        if left != right:  # Not a leaf node
            # Propagate lazy update to children
            lazy_l, lazy_r = self.st[index].lazy.split(left, right)
            
            # Update left child
            self.st[2 * index].lazy.update_lazy(lazy_l)
            self.st[2 * index].has_lazy = True
            
            # Update right child
            self.st[2 * index + 1].lazy.update_lazy(lazy_r)
            self.st[2 * index + 1].has_lazy = True
        
        # Clear current node's lazy update
        self.st[index].lazy = Lazy()
        self.st[index].has_lazy = False
    
    def update(self, lower, upper, value):
        """
        Add 'value' to all elements in range [lower, upper].
        
        Args:
            lower, upper: Range to update (1-indexed, inclusive)
            value: Value to add to all elements in range
        """
        self._update(1, 1, self.n, lower, upper, value)
    
    def _update(self, index, left, right, lower, upper, value):
        """
        Recursive helper for range updates.
        
        Args:
            index: Current node index
            left, right: Range this node represents
            lower, upper: Range to update
            value: Value to add
        """
        # Apply any pending lazy updates first
        self.propagate(index, left, right)
        
        # No overlap with update range
        if left > right or left > upper or right < lower:
            return
        
        # Current node is completely within update range
        if lower <= left and right <= upper:
            # Apply lazy update to this node
            lazy = Lazy(value)
            self.st[index].lazy.update_lazy(lazy)
            self.st[index].has_lazy = True
            self.propagate(index, left, right)
            return
        
        # Partial overlap - recurse to children
        mid = left + (right - left) // 2
        self._update(2 * index, left, mid, lower, upper, value)
        self._update(2 * index + 1, mid + 1, right, lower, upper, value)
        
        # Update current node by merging children
        self.st[index].data.merge(self.st[2 * index].data, self.st[2 * index + 1].data)
    
    def query(self, lower, upper):
        """
        Get sum of elements in range [lower, upper].
        
        Args:
            lower, upper: Range to query (1-indexed, inclusive)
            
        Returns:
            Data object containing sum and size of the range
        """
        return self._query(1, 1, self.n, lower, upper)
    
    def _query(self, index, left, right, lower, upper):
        """
        Recursive helper for range queries.
        
        Args:
            index: Current node index
            left, right: Range this node represents
            lower, upper: Range to query
            
        Returns:
            Data object with query result
        """
        # Apply any pending lazy updates first
        self.propagate(index, left, right)
        
        # No overlap with query range
        if left > right or left > upper or right < lower:
            return Data()  # Return empty data
        
        # Current node is completely within query range
        if lower <= left and right <= upper:
            return self.st[index].data
        
        # Partial overlap - recurse to children and merge results
        mid = (left + right) // 2
        left_result = self._query(2 * index, left, mid, lower, upper)
        right_result = self._query(2 * index + 1, mid + 1, right, lower, upper)
        
        # Merge results from both children
        result = Data()
        result.merge(left_result, right_result)
        return result


def main():
    """
    Main function to handle input/output and demonstrate segment tree usage.
    
    Input format:
    - First line: n (array size) and q (number of queries)
    - Second line: n integers (the array elements)
    - Next q lines: either
        - "1 l r" for sum query in range [l, r]
        - "2 l r value" for adding 'value' to range [l, r]
    """
    # Read input
    n, q = map(int, input().split())
    a = list(map(int, input().split()))
    
    # Build segment tree
    tree = SegmentTree()
    tree.build(a)
    
    # Process queries
    for _ in range(q):
        query_data = list(map(int, input().split()))
        query_type = query_data[0]
        l, r = query_data[1], query_data[2]
        
        if query_type == 1:
            # Sum query
            result = tree.query(l, r)
            print(result.suma)
        else:
            # Range update
            value = query_data[3]
            tree.update(l, r, value)


if __name__ == "__main__":
    main()
