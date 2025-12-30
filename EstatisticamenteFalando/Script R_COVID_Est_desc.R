#########################################################################
#
# CTeSP Estatística Descritiva - COVID
#
#########################################################################

############# Passos Iniciais

# Leitura do ficheiro de dados (data frame)

getwd() #devolve a diretoria onde está o script R
#colocar o ficheiro de dados na mesma diretoria

setwd("C:/Users/Utilizador/Dropbox/ESTG/0_CTESP_Oficina_Estatistica/0_Aulas/BD_COVID")

setwd("C:/Users/Utilizador/Dropbox/ESTG/0_CTESP_OE/0_CTESP_OE_25_26/1_Aulas/BD_COVID_Resumo")

covid=read.table("COVID.txt",header=T)
#covid

#?prop.table() # pedir ajuda com o ?

#ou

#install.packages("readxl") #para instalar o pacote, não voltar a instalar!!!
#library(readxl) # chama o comando em argumento
#dados=read_excel("COVID.xlsx")


fa_e=table(covid$estado)
fa_e
round(prop.table(table(covid$cuidados)),2)

#Visualização das variáveis
#names(covid) # Nome das variáveis


# Para aceder diretamente às colunas do data frame pelos seus nomes
attach(covid)# Caso contrário teríamos de identificar dados$genero; dados$condicao, ...


########## Tabelas de Frequências absolutas/relativas/Acumuladas e de dupla entrada 

# frequências absolutas (contagem de cada atributo) ajuda na classificação!
fa_r=table(regiao)#Qualitativa, nominal 
fa_r

fa_g=table(genero)#Qualitativa, nominal (binominal)
fa_g
fa_e=table(estado)#Qualitativa, nominal
fa_c=table(cuidados)#Qualitativa, nominal
round(prop.table(fa_c),2)

fa_d=table(dor)#Qualitativa, ordinal
fa_a=table(agregado)#Quantitativa, discreta
fa_a

table(idade) #Quantitativa, discreta mas deve ser tratada como contínua
fa_D=table(duracao)#Quantitativa contínua (tempo)
fa_D

#prop.table(table(regiao))# freq. relativas (percentagem de cada atributo)

fr_D=prop.table(fa_D)
fr_D
#fr_D

##### Tabelas de Dupla entrada: duas variáveis qualit ou discretas
TDa_GE=table(genero,estado)#Cria uma tabela de dupla entrada: de duas variáveis
TDa_GE
TDa_GC=table(genero,cuidados) 
TDa_GC
TDr_CD=prop.table(table(cuidados,dor))
round(TDr_CD,2)


##########  A importância de classificar as variáveis: 
 ### visualização, tratamento e interpretação
      # Uma variável e respetivas contagens
          #Qualitativa Nominal: circular (não quantificável)
          #Qualitativa Ordinal: Barras (por ordem!)
          #Quantitativa discreta: Barras (por ordem!)
          #Quantitativa Contínua: Histograma (por ordem!)


# Gráfico circular, de frequências absolutas/relativas
        # Variáveis qualitativas nominais

#fa_C=table(cuidados)
pie(fa_c)

nomes_c<-c("Casa","UCC","UCI")
cores<-c("blue","skyblue","green")
rotulo<-paste(nomes_c,"(",paste(fa_c),")",sep=" ")
pie(fa_c, main="Número de Indivíduos por Cuidados prestados",labels=rotulo,col=cores)


fa_E=table(estado)
pie(fa_E)
fr_E<-prop.table(fa_E) #neste usei freq relativas
fr_E
E<-c("Óbitos","Ativos","Recuperados")
cores<-c("pink","skyblue","blue")
texto<-paste(E,"(",paste(round(fr_E,2)*100),"%)",sep="  ")
pie(fr_E, main="Percentagem de Indivíduos por Estado atual",labels=texto,col=cores)


# Gráfico de barras de Frequências absolutas/relativas 
    #Variáveis discretas pouco díspares ou variáveis ordinais (+-10 valores)
fa_A<-table(agregado) 
fa_A
fr_A<-prop.table(fa_A)
fr_A
barplot(fa_A,main="Número de contágios no agregado",xlab="contágios",ylab="Número de indivíduos",col="skyblue", ylim=c(0,40))
#text(locator(n=8),paste(round(fr_A,2))) # STOP CONSOLA, clicar nas barras!!!!!

#caso considerassemos contínua não obteríamos informação relevante
h<-hist(agregado,main="Distribuição dos contágios",xlab="contagios no agregado",ylab="Número de indivíduos", col="seagreen",ylim=c(0,100),xlim=c(0,50))
h


fa_D<-table(dor) 
fa_D
fr_D<-prop.table(fa_D)
fr_D
nomes_D<-c("Muito Fraca","Fraca","Suportável","Forte","Muito Forte")
cores<-c("blue","skyblue","seagreen","green","yellow")
barplot(fr_D,main="Distribuição dos utentes pela intensidade da dor",xlab="Intensidade",ylab="% de indivíduos", names.arg=nomes_D,col=cores, ylim=c(0,0.35))
#text(locator(n=5),paste(round(fr_D,2))) # STOP CONSOLA, clicar nas barras!!!!!

barplot(fa_D,main="Distribuição dos utentes pela intensidade da dor",xlab="Intensidade",ylab="% de indivíduos", names.arg=nomes_D,col=cores, ylim=c(0,35))
fa_D



######## Histograma, Var contínuas
      #O histograma é muito mais complexo porque agrupa variáveis em intervalos
fr_dur= prop.table(table(duracao))
barplot(fr_dur)

#table(duracao) # o grafico de barras não é adequado a esta var
h<-hist(duracao,main="Distribuição da duração do tratamento",xlab="duração (em dias)",ylab="Número de indivíduos", col="blue",ylim=c(0,40),xlim=c(0,70))
h # O R define as classes pela regra de Struges k=1+3.3logn

fr_D=h$counts
fr_D

freq_rel=h$counts/103 # O R calcula density que são freq relativas corrigidas 
freq_rel
#text(locator(n=7),paste(round(freq_rel,4)))# STOP CONSOLA, clicar nas barras!!!!!



#Não faz sentido trabalhar a dispersão da idade como var discreta
    freq_i=table(idade)
    freq_i
    barplot(freq_i,main="Distribuição da idade",xlab="idade (em anos)",ylab="Nº de indivíduos",col=cores,ylim=c(0,5))
                                                                                                          
#Então tratamos como var contínua e usamos o histograma

h2<-hist(idade,main="Distribuição da idade",xlab="idade (em anos)",ylab="Número de indivíduos", col="seagreen",ylim=c(0,80),xlim=c(0,350))
h2 


####### Diagrama de Extremos e quartis
#ótimos para detetar outliers

# Boxplot Simples (medidas de localização e dispersão)
b=boxplot(idade, main="Diagrama de extremos e quartis",ylab="idade",col="skyblue")
b
summary(idade) #para interpretar os valores do boxplot
IQR(idade) #amplitude Interquartil

# Ou pelas frequências absolutas:
table(idade)

b2=boxplot(duracao, main="Distribuição da var duração",ylab="duracao",col="skyblue")
b2
IQR(duracao)
summary(duracao) #para interpretar os valores do boxplot
# Ou pelas frequências absolutas:
table(duracao)
?boxplot



# Boxplot múltiplo (y numérica ~ x nominal ou ordinal)

bx_D=boxplot(duracao ~ genero, main = "Comparação da duração do tratamento por genero", ylab="duração (dias)", xlab="", names=c("Feminino","Masculino"),col=c("pink","blue"))
bx_D
tapply(duracao,genero,summary)# Para interpretar os valores do boxplott
mean_D=tapply(duracao,genero,mean)# Para interpretar a média dos grupos
sd_D=tapply(duracao,genero,sd)# Para interpretar o desvio padrão dos grupos
sd_D
CV_D=sd_D/mean_D #calculo do coef. de variação para a representatividade das médias
CV_D

# Ou pelas frequências absolutas de dupla entrada:
table(genero,dor)
boxplot(dor~genero, col=c("pink", "skyblue"))
tapply(dor,genero,summary)

boxplot(idade ~ regiao, main = "Comparação da idade por região", ylab="Idade", xlab="",col=c("pink","blue"))
tapply(idade,regiao,summary)

boxplot(duracao~genero)

boxplot(idade ~ cuidados, main = "Comparação da idade por cuidados", ylab="Idade", xlab="",col=c("pink","blue"))
tapply(idade,cuidados,summary)# Para interpretar os valores do boxplot
table(cuidados,idade)# Identificar os valores extremos

boxplot(dor ~ genero, main = "Comparação da intensidade da dor por genero", ylab="Intensidade dor", xlab="", names=c("Feminino","Masculino"),col=c("pink","blue"))
tapply(dor,genero,summary)# Para interpretar os valores do boxplot
table(cuidados,genero)# Identificar os valores extremos



############ Gráfico de barras empilhado que cruze a var cuidados (empilhado) com a variável genero
#Identico ao boxplot mas para variáveis qualitativas ou discretas 

cores<-c("seagreen","yellow","skyblue","red")
t<-table(cuidados,genero)
t
colnames(t)<-c("Feminino","Masculino")
rownames(t)<-c("Casa","UCC", "UCI")
barplot(t,col=cores,ylab="Número de Indivíduos",xlab="",main="Cuidados prestados por género",legend=T,ylim=c(0,80))

################## REGRESSÃO LINEAR (comparar 2 var numéricas)
# nuvem de Pontos
# Representação gráfica do diagrama de Dispersão da amostra!!!

#plot(idade, duracao) #plot(X,Y) e X-var Ind e Y - Var Dependente!!!!

plot(idade,duracao, main="Diagrama de dispersão", xlab="idade em Anos",
     ylab="duração do tratamento", col="blue")

# reta de regressão (estudo analitico)

rl=lm(duracao~idade) # Y em função de X
rl
#(Intercept) =a            b= declive em relação a IDADE  
#23.057874                         0.004773   

# duracao  = intecept + b x idade = 23.057874  + 0.004773  * IDADE

#Previsão  (in the box e out of the box)
#predict(rl)
abline(rl,col="red") # reta 

# Com uma média de seis anos o tratamento estimado será de 12.8 valores
23.057874  + 0.004773 * 6 # aprox 23 dias
23.057874  + 0.004773 * 380  # 24 dias, valor fora do intervalo!!!
# Com uma média de 13 valores, quantas horas deve dormir, em média?
#idade = (duracao-23.057874)/0.004773
(60-23.057874)/0.004773 #= tratamento de 60 dias a pessoa tem provavelmente 7739.81 anos!!!!

# Coeficientes de correlação e de determinação
cor(idade,duracao) # r= 0.01633882 a Associação é fraca e traduz uma relação fraca e positiva
cor(idade,duracao)^2 #r^2 =0.000266957 isto é, o modelo não é bom porque só explica 0.02669 % da variável Duração
#ou
summary(rl)
