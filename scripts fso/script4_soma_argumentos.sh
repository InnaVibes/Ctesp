#!/bin/bash
soma=0
for valor in $*
do
    soma=$((soma + valor))
done
echo "A soma é: $soma"
