#!/bin/bash

if [ -f .processes ] ; 
then
    while read p ; do
        kill -9 $p
    done < .processes
    rm .processes
else
    echo "./start.sh have not been lunched."
fi