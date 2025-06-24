import heapq
# --- Minheap ---
minheap = [5, 3, 8, 1, 7]

heapq.heapify(minheap)
print("Minheap:", minheap)

min_val = heapq.heappop(minheap)
print("Elemento mínimo extraído:", min_val)

# --- Maxheap ---
# Una técnica común es almacenar los valores negativos.
arr = [5, 3, 8, 1, 7]
maxheap = [-x for x in arr]

heapq.heapify(maxheap)
print("Maxheap:", [-x for x in maxheap])

max_val = -heapq.heappop(maxheap)
print("Elemento máximo extraído:", max_val)