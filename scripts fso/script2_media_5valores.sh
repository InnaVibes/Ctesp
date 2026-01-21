#!/bin/bash
echo "Introduza o 1º valor: "
read val1
echo "Introduza o 2º valor: "
read val2
echo "Introduza o 3º valor: "
read val3
echo "Introduza o 4º valor: "
read val4
echo "Introduza o 5º valor: "
read val5
soma=$((val1 + val2 + val3 + val4 + val5))
media=$((soma / 5))
echo "A média é: $media"
