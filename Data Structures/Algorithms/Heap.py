import sys
import heapq

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Cola de prioridad (min-heap) para asignar recursos
 * Problema  : CSES 1164 - Room Allocation (https://cses.fi/problemset/task/1164)
 * Entrada   : n, luego n pares "llegada salida"
 * Salida    : mínimo de habitaciones y la habitación de cada cliente
 * Complejidad: tiempo O(n log n), memoria O(n)
"""


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    arr = list(map(int, data[1:2 * n + 1:2]))
    dep = list(map(int, data[2:2 * n + 2:2]))
    # se ordenan los clientes por hora de llegada
    order = sorted(range(n), key=arr.__getitem__)

    # min-heap de salida * 2^18 + habitación: la habitación que se libera primero
    SHIFT = 1 << 18
    heap = []
    room = [0] * n
    rooms = 0
    for i in order:
        # si la habitación más pronta ya se liberó, se reutiliza
        if heap and heap[0] // SHIFT < arr[i]:
            r = heapq.heappop(heap) % SHIFT
        else:
            # si no, se abre una habitación nueva
            rooms += 1
            r = rooms
        room[i] = r
        heapq.heappush(heap, dep[i] * SHIFT + r)

    print(rooms)
    print(" ".join(map(str, room)))


main()
