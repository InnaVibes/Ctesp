#!/bin/bash
echo "Menu:"
echo "1 - Calendário do mês atual"
echo "2 - Data atual"
echo "Escolha uma opção: "
read opcao
case "$opcao" in
    "1") cal ;;
    "2") date ;;
    *) echo "Opção inválida" ;;
esac
