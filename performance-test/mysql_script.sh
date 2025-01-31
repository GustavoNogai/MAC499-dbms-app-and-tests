#!/bin/bash

# Se quiser executar o script localmente não esqueça de mudar o USER e o PASSWORD abaixo!
USER="root"
PASSWORD="root"

# Fazer o separador ser a quebra de linha
IFS=$'\n'
# Faz o comando time formatar em tempo real
TIMEFORMAT=%R

# Número de queries
QUERY_NUM=0
# Número de repetições
NUM_RUNS=30

# Cabeçalho dos resultados
echo "Query Number|Query|Run|Elapsed Time" >> results.txt

# Executar testes
for (( i=1; i<=$NUM_RUNS; i++ ))
do
    for query in $(cat queries/mysql_queries.txt)
    do
        QUERY_NUM=$((QUERY_NUM + 1))
	echo "query $i: $query"
	ELAPSED_TIME=$({ time mysql --user=$USER --password=$PASSWORD --database=StackOverflow -e $query; } 2>&1 > /dev/null )
	echo "${QUERY_NUM}|${query}|${i}|$ELAPSED_TIME" >> results.txt 
	echo "Elapsed Time: $ELAPSED_TIME"
    done
    
    QUERY_NUM=0
done
