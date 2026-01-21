#!/bin/bash
echo "Introduza números (termine com -1): "
read numero
maior=$numero
while [ $numero -ne -1 ]
do
    if [ $numero -gt $maior ]
    then
        maior=$numero
    fi
    read numero
done
echo "O maior valor é: $maior"
