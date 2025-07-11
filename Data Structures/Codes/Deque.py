from collections import deque

# Crear un deque
d = deque(["a", "b", "c"])
print("Deque inicial:", list(d))

# Agregar un elemento a la derecha
d.append("d")
print("Despues de append:", list(d))

# Agregar un elemento a la izquierda
d.appendleft("z")
print("Despues de appendleft:", list(d))

# Remover el primer elemento (popleft)
left_elem = d.popleft()
print("Elemento removido (popleft):", left_elem)
print("Deque tras popleft:", list(d))

# Remover el ultimo elemento (pop)
right_elem = d.pop()
print("Elemento removido (pop):", right_elem)
print("Deque tras pop:", list(d))