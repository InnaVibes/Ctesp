#!/bin/bash
inicio=$1
fim=$2
for (( numero=$inicio; numero<=$fim; numero++ ))
do
    echo $numero
done
