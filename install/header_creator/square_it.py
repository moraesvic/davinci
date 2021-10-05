#!/usr/bin/python3

import sys

if len(sys.argv) != 2:
    print(f"Usage: {sys.argv[0]} TEXT_TO_BE_SQUARED")
    exit()

string = sys.argv[1]
arr = string.split('\n')
print("#" * 60)

for line in arr:
    print(f"# {line}", end="")
    print(" " * (60 - len(line) - 3), end="")
    print("#")

print("#" * 60)
