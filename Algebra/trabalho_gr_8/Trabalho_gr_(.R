getwd() #devolve a diretoria onde est? o script R
#colocar o ficheiro de dados na mesma diretoria

setwd("C:/Users/mauro/Desktop/Universidade/2_ANO/1_SEMESTRE/ESTATISTICA/trabalho_gr_8")
#install.packages("readxl") #para instalar o pacote, n?o voltar a instalar!!!
library(readxl) # chama o comando em argumento
dados=read_excel("INE.xlsx")

#Nome das variáveis
names(dados)
#Para aceder aos dados
attach(dados)

#Mun- Variável qualitativa ordinal
#NUTS II- Variável qualitativa nominal
#VRefAq - Variável quantitativa contínua
#VRefAr - Variável quantitativa contínua
#n.Nucleos - Variável quantitativa discreta
#Equipa - Variável qualitativa nominal

fa_n=table(`NUTS II`)
fa_n

fa_e=table(Equipa)
fa_e

pie(fa_n)
cores_n<-c("blue","green")
nomes_n<-c("Norte","Centro")
rotulo_n<-paste(nomes_n,"(",paste(fa_n),")",sep=" ")
pie(fa_n, main="Numero de Municios por região",labels=rotulo_n,col=cores_n)


h_ar<-hist(VRefAr,main="Distribuição dos valores de arrendamento",xlab="Valores de Arrendamento",ylab="Numero de Municipios", col="blue",ylim=c(0,40),xlim=c(2,9))
h_ar

h_aq<-hist(VRefAq,main="Distribuição dos valores de aquisição",xlab="Valores de Aquisição",ylab="Numero de Municipios", col="blue",ylim=c(0,50),xlim=c(600,2800))
h_aq

N=72
fr_AQ=round(h_aq$counts/N,2)
fr_AQ
