#!/usr/bin/python

import sys

if len(sys.argv) != 2:
    print "Usage: %s TEXT_TO_BE_SQUARED" % sys.argv[0]
    exit()

string = sys.argv[1]
arr = string.split('\n')
print "#" * 60 

for line in arr:
    print "#", line,
    print " " * (60 - len(line) - 5) ,
    print "#" 

print "#" * 60 
