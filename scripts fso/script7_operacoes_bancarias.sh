#!/bin/bash
echo "Introduza o saldo atual: "
read saldo
echo "Introduza o montante (positivo para crédito, negativo para débito): "
read montante
novo_saldo=$((saldo + montante))
if [ $novo_saldo -ge 0 ]
then
    echo "Operação realizada com sucesso"
    echo "Novo saldo: $novo_saldo"
else
    echo "Operação impossível por saldo insuficiente"
fi
