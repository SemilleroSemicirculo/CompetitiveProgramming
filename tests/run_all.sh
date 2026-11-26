#!/bin/sh
# Corre todas las pruebas: compila cada código, prueba el ejemplo, compara contra fuerza bruta
# en casos al azar y mide el caso máximo. Uso: sh tests/run_all.sh [n_aleatorias]
cd "$(dirname "$0")/.."
for m in tests/t_*.py; do python3 tests/runner.py "$(basename "$m" .py)" "${1:-100}"; done
