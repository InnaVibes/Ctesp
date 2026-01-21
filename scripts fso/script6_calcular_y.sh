#!/bin/bash
echo "Introduza um número X: "
read x
if [ $x -lt 1 ]
then
    y=$x
elif [ $x -eq 1 ]
then
    y=0
else
    y=$((2 * x))
fi
echo "Y = $y"
