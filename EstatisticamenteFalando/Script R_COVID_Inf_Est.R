#########################################################################
#
# CTeSP DWDM - COVID Inferência Estatística
#
#########################################################################

attach(covid)

##########################   Testes de Hipóteses

############## Var Qualitativas ou cruzamentos de Qualitativas

#uma proporção (Dois grupos Ho: p=0.5)

fa_g=table(genero)
prop.test(table(genero))
prop.test(fa_g) #p-value = 0.1678   > 0.05  não se rej Ho
                # A probabilidade será de 0.5 (Não há diferenças significativas)
                #95 percent confidence interval: ]0.4715570 ; 0.6685768[


# Mais do que uma proporção ou tabela de dupla entrada de fabsolutas 

TDa_GC=table(cuidados,genero)
###prop.test(TDa_GC) # dá erro! porque apresenta mais do que duas proporções 

chisq.test(TDa_GC) # Inconclusivo por má aproximação à distribuição Qui-quadrado

TDa_GE=table(genero,estado)
chisq.test(TDa_GE) #p-value = 0.5034 > 0.05  não se rej Ho
                  # Não há diferenças significativas nas probabilidades dentro dos seis grupos definidos pela tabela (100%/6)!



############### Uma Var Qualitativa cruzada com uma Numérica

#######Teste à normalidade da var numérica (se TLC não for garantido, n>30)
shapiro.test(duracao) #p-value = 0.0002826 < 0.05 rejeita-se Ho
                      # A var não é normal
                      # Mas como n=103> 30, pelo TLC considera-se a normalidade


qqnorm(duracao)# Vizualização de ajustamento da Normal
qqline(duracao)

#######Teste a duas ou mais médias (da var numérica)

#t.test(v_numérica~ qualitativa com 2 grupos)
t.test(duracao~genero)  # p-value = 1.804e-05 = 0.00001804 < 0.05, rej Ho
                        # a duração média do tratamento é diferente nos grupos F e M
                        # O int confiança para a diferença é negativa:-13.657844  -5.435377
                        # A média da duração no grupo Feminino é menor que no grupo Masc

#Anova(lm(v_numérica~3 ou mais grupos))
#?anova
anova(lm(duracao~dor)) # Valor de prova: 0.7693 > 0.05, não rej Ho
                      # As médias são iguais em todos os grupo
                      # ou não há diferenças significativas na duração do tratamento entre os grupos definidos pela dor 
                      # ou os grupos definidos pela variavel dor, não provocam dif sign na média do duração do Tratamento


##############Teste não paramétricos a duas ou mais medianas (da var numérica), falha a normalidade

#wilcox.test(var numérica, grupos)
wilcox.test(duracao,genero) #p-value < 2.2e-16 < 0.05, Rej Ho, as medianas são diferentes

kruskal.test (duracao,dor) # p-value = 0.7897, As medianas populacionais são iguais


############################## Regressão Linear
# nuvem de Pontos
# Representação gráfica do diagrama de Dispersão


plot(idade,duracao, main="Diagrama de dispersão", xlab="idade em Anos",
     ylab="duração do tratamento", col="blue")

# reta de regressão (estudo analitico)

rl=lm(duracao~idade) #lm (y dependente ~x independente)
rl
#(Intercept) =a            b= declive em relação a IDADE  
#23.057874                         0.004773   

# duracao  = intecept + b x idade  + erro = 23.057874  + 0.004773  * IDADE + erro

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
cor(idade,duracao) # r= 0.01633882 
cor(idade,duracao)^2 #r^2 =0.000266957 




################# Testes da Regressão Linear para a população

### Testes ao coeficiente e intercept (y=a*x + b) 
summary(rl) # Podem anular-se?

### Teste à Normalidade das variáveis
shapiro.test(idade)
shapiro.test(duracao)

### Teste à Normalidade dos erros de rl (modelo de reg. linear)
shapiro.test(rl$residuals) #p-value = 0.0002721 <0.05 Rej. Ho

qqnorm(rl$residuals) # representação gráfica da norm dos erros
qqline(rl$residuals) # reta do ajustamento dos erros à distribuição Normal 

#### Teste à autocorrelação dos resíduos (rho)
install.packages("car")
library(car)
durbinWatsonTest(rl) #p-value:0.458 > 0.05 Não rej ho rho pode anular-se
                    # A autocorrelação dos resíduos é nula logo são independentes
                    # Verifica o pressuposto da regressão linear
