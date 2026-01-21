#!/bin/bash
echo "Introduza o primeiro número: "
read num1
echo "Introduza o segundo número: "
read num2
echo "Introduza a operação (+, -, *, /): "
read operacao
case "$operacao" in
    "+") resultado=$((num1 + num2)) ;;
    "-") resultado=$((num1 - num2)) ;;
    "*") resultado=$((num1 * num2)) ;;
    "/") resultado=$((num1 / num2)) ;;
    *) echo "Operação inválida"; exit ;;
esac
echo "O resultado é: $resultado"
