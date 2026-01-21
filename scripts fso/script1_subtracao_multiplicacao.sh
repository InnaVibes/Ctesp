#!/bin/bash
echo "Introduza o primeiro número: "
read num1
echo "Introduza o segundo número: "
read num2
subtracao=$((num1 - num2))
resultado=$((subtracao * num1))
echo "Resultado: $resultado"
