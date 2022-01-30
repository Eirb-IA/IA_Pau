#!/bin/bash

if [ -f .processes ] ; 
then
    rm .processes
fi

cd eirbia_surf_back && npm run dev &
echo $! >> .processes
cd eirbia_surf_front && npm run dev &
echo $! >> .processes