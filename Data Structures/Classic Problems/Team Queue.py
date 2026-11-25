import sys
from collections import deque

input = sys.stdin.readline
INF = float('inf')
MOD = 998244353

"""
 * Algoritmo : Cola de equipos (cola de colas)
 * Problema  : UVa 540 - Team Queue
 * Entrada   : varios casos: n equipos con sus miembros y órdenes ENQUEUE x / DEQUEUE / STOP, terminando con n = 0
 * Salida    : cada elemento desencolado, bajo "Scenario #t"
 * Complejidad: tiempo O(1) por operación, memoria O(n)
"""


def main():
    data = sys.stdin.read().split()
    pos = 0
    out = []
    scenario = 0
    while True:
        t = int(data[pos])
        pos += 1
        if t == 0:
            break
        scenario += 1
        out.append("Scenario #%d" % scenario)

        # team_of[x] = equipo al que pertenece x
        team_of = {}
        for team in range(t):
            m = int(data[pos])
            pos += 1
            for x in data[pos:pos + m]:
                team_of[x] = team
            pos += m

        # cola de cada equipo y cola de equipos que tienen alguien esperando
        team_queue = [deque() for _ in range(t)]
        queue = deque()
        while True:
            cmd = data[pos]
            pos += 1
            # fin del caso
            if cmd == "STOP":
                break
            if cmd == "ENQUEUE":
                x = data[pos]
                pos += 1
                tm = team_of[x]
                # el nuevo entra a la cola de su equipo; si el equipo estaba vacío, el equipo entra al final
                if not team_queue[tm]:
                    queue.append(tm)
                team_queue[tm].append(x)
            else:
                # DEQUEUE: sale el primero del equipo que está al frente
                tm = queue[0]
                out.append(team_queue[tm].popleft())
                # si el equipo se vacía, deja la cola de equipos
                if not team_queue[tm]:
                    queue.popleft()
        out.append("")
    print("\n".join(out))


main()
