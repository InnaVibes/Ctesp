#!/bin/bash
echo "Introduza o número inicial: "
read inicio
echo "Introduza o número final: "
read fim
for (( numero=$inicio; numero<=$fim; numero++ ))
do
    echo $numero
done
