#!/usr/bin/env python3

import sys
import os
import re
import math

PROGRAM_NAME = os.path.basename(sys.argv[0])

# I am trying to understand the best practices, but keep note that
# sys.exit("error message") also works and returns non-zero exit
# code

def printerr(*args, **kwargs):
    print(f"{PROGRAM_NAME} : ", *args, file=sys.stderr, **kwargs)

############################################################
### TESTING SANITY OF INPUT ################################
############################################################


if len(sys.argv) != 3:
    printerr(f"USAGE: {PROGRAM_NAME} RESOLUTION MAX_RESOLUTION")
    sys.exit(1)

orig_resolution = sys.argv[1]

resolution_search = re.search(r"^(\d+)x(\d+)$", orig_resolution)
if not resolution_search:
    printerr("Resolution given in wrong format. Follow the example: 1024x680 , with no spaces")
    sys.exit(1)


try:
    max_resolution = int(sys.argv[2])
except ValueError:
    printerr("Maximal resolution must be an integer in base 10")
    sys.exit(1)

############################################################
### CALCULATING REDUCTION FACTOR ###########################
############################################################


width = int(resolution_search.group(1))
height = int(resolution_search.group(2))
biggest = max(width, height)

factor = 1.0 if biggest <= max_resolution else max_resolution / biggest

# Factor will be printed as a percentage
print(math.floor( factor * 100  ))
