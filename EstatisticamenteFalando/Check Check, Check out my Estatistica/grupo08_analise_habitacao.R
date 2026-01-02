# ============================================================================
# TRABALHO DE ESTATISTICA - TEMA 8
# Analise do Custo da Habitacao em Municipios de Portugal
# Script em R para RStudio
# ============================================================================

# Instalar pacotes (descomentar se necessario)
# install.packages("readxl")
# install.packages("ggplot2")
# install.packages("dplyr")
# install.packages("e1071")

library(readxl)
library(ggplot2)
library(dplyr)
library(e1071)

# ============================================================================
# 1. IMPORTACAO DOS DADOS
# ============================================================================

# Carregar dados - Ajustar caminho conforme necessario
dados <- read_excel("grupo08.xlsx")

head(dados)
str(dados)
summary(dados)

# ============================================================================
# 2. ANALISE DAS VARIAVEIS QUALITATIVAS
# ============================================================================

# 2.1 NUTS II (Regiao)
freq_nuts <- table(dados$NUTS_II)
freq_nuts_rel <- prop.table(freq_nuts) * 100

cat("\n=== NUTS II (REGIAO) ===\n")
cat("Frequencias Absolutas:\n")
print(freq_nuts)
cat("\nFrequencias Relativas (%):\n")
print(round(freq_nuts_rel, 2))

# Grafico de sectores
png("Grafico_NUTS_II.png", width=800, height=600, res=120)
pie(freq_nuts, 
    main="Distribuicao dos Municipios por Regiao (NUTS II)",
    col=c("skyblue", "lightgreen"),
    labels=paste(names(freq_nuts), "\n", freq_nuts, " (", round(freq_nuts_rel, 1), "%)", sep=""))
dev.off()

# 2.2 Equipa
freq_equipa <- table(dados$Equipa)
freq_equipa_rel <- prop.table(freq_equipa) * 100

cat("\n=== EQUIPA ===\n")
cat("Frequencias Absolutas:\n")
print(freq_equipa)
cat("\nFrequencias Relativas (%):\n")
print(round(freq_equipa_rel, 2))

png("Grafico_Equipa.png", width=800, height=600, res=120)
barplot(freq_equipa,
        main="Distribuicao dos Municipios por Equipa",
        xlab="Equipa",
        ylab="Frequencia Absoluta",
        col="steelblue",
        ylim=c(0, max(freq_equipa)*1.2))
text(x=barplot(freq_equipa, plot=FALSE), 
     y=freq_equipa + 1, 
     labels=freq_equipa, 
     pos=3)
dev.off()

# ============================================================================
# 3. ANALISE DO VALOR DE REFERENCIA DA AQUISICAO (VRefAq)
# ============================================================================

cat("\n=== VALOR DE REFERENCIA DA AQUISICAO (VRefAq) ===\n")

# Medidas de Localizacao
media_aq <- mean(dados$VRefAq)
mediana_aq <- median(dados$VRefAq)
moda_aq <- as.numeric(names(sort(table(dados$VRefAq), decreasing=TRUE)[1]))
q1_aq <- quantile(dados$VRefAq, 0.25)
q3_aq <- quantile(dados$VRefAq, 0.75)

cat("MEDIDAS DE LOCALIZACAO:\n")
cat(sprintf("Media: %.2f euros/m2\n", media_aq))
cat(sprintf("Mediana: %.2f euros/m2\n", mediana_aq))
cat(sprintf("Moda: %.2f euros/m2\n", moda_aq))
cat(sprintf("Quartil 1 (Q1): %.2f euros/m2\n", q1_aq))
cat(sprintf("Quartil 3 (Q3): %.2f euros/m2\n", q3_aq))

# Medidas de Dispersao
amplitude_aq <- max(dados$VRefAq) - min(dados$VRefAq)
variancia_aq <- var(dados$VRefAq)
desvio_padrao_aq <- sd(dados$VRefAq)
cv_aq <- (desvio_padrao_aq / media_aq) * 100
aiq_aq <- q3_aq - q1_aq

cat("\nMEDIDAS DE DISPERSAO:\n")
cat(sprintf("Amplitude: %.2f euros/m2\n", amplitude_aq))
cat(sprintf("Variancia: %.2f\n", variancia_aq))
cat(sprintf("Desvio Padrao: %.2f euros/m2\n", desvio_padrao_aq))
cat(sprintf("Coeficiente de Variacao: %.2f%%\n", cv_aq))
cat(sprintf("Amplitude Interquartil: %.2f euros/m2\n", aiq_aq))

# Medidas de Forma
assimetria_aq <- skewness(dados$VRefAq)
curtose_aq <- kurtosis(dados$VRefAq) + 3

cat("\nMEDIDAS DE FORMA:\n")
cat(sprintf("Assimetria: %.4f\n", assimetria_aq))
cat(sprintf("Curtose: %.4f\n", curtose_aq))

# Histograma VRefAq
png("Histograma_VRefAq.png", width=1000, height=700, res=120)
hist(dados$VRefAq,
     main="Histograma - Valores de Referencia de Aquisicao",
     xlab="Valor de Aquisicao (euros/m2)",
     ylab="Frequencia Absoluta",
     col="lightblue",
     border="darkblue",
     breaks=15)
abline(v=media_aq, col="red", lwd=2, lty=2)
abline(v=mediana_aq, col="green", lwd=2, lty=2)
legend("topright", 
       legend=c(paste("Media =", round(media_aq, 2)), 
                paste("Mediana =", round(mediana_aq, 2))),
       col=c("red", "green"), lwd=2, lty=2)
dev.off()

# Boxplot VRefAq
png("Boxplot_VRefAq.png", width=600, height=800, res=120)
boxplot(dados$VRefAq,
        main="Diagrama de Extremos e Quartis\nValor de Referencia de Aquisicao",
        ylab="Valor de Aquisicao (euros/m2)",
        col="lightblue",
        border="darkblue")
abline(h=media_aq, col="orange", lwd=2, lty=3)
legend("topright", 
       legend=paste("Media =", round(media_aq, 2)),
       col="orange", lwd=2, lty=3)
dev.off()

# ============================================================================
# 4. ANALISE DO VALOR DE REFERENCIA DO ARRENDAMENTO (VRefAr)
# ============================================================================

cat("\n=== VALOR DE REFERENCIA DO ARRENDAMENTO (VRefAr) ===\n")

# Medidas de Localizacao
media_ar <- mean(dados$VRefAr)
mediana_ar <- median(dados$VRefAr)
moda_ar <- as.numeric(names(sort(table(dados$VRefAr), decreasing=TRUE)[1]))
q1_ar <- quantile(dados$VRefAr, 0.25)
q3_ar <- quantile(dados$VRefAr, 0.75)

cat("MEDIDAS DE LOCALIZACAO:\n")
cat(sprintf("Media: %.2f euros/m2\n", media_ar))
cat(sprintf("Mediana: %.2f euros/m2\n", mediana_ar))
cat(sprintf("Moda: %.2f euros/m2\n", moda_ar))
cat(sprintf("Quartil 1 (Q1): %.2f euros/m2\n", q1_ar))
cat(sprintf("Quartil 3 (Q3): %.2f euros/m2\n", q3_ar))

# Medidas de Dispersao
amplitude_ar <- max(dados$VRefAr) - min(dados$VRefAr)
variancia_ar <- var(dados$VRefAr)
desvio_padrao_ar <- sd(dados$VRefAr)
cv_ar <- (desvio_padrao_ar / media_ar) * 100
aiq_ar <- q3_ar - q1_ar

cat("\nMEDIDAS DE DISPERSAO:\n")
cat(sprintf("Amplitude: %.2f euros/m2\n", amplitude_ar))
cat(sprintf("Variancia: %.2f\n", variancia_ar))
cat(sprintf("Desvio Padrao: %.2f euros/m2\n", desvio_padrao_ar))
cat(sprintf("Coeficiente de Variacao: %.2f%%\n", cv_ar))
cat(sprintf("Amplitude Interquartil: %.2f euros/m2\n", aiq_ar))

# Medidas de Forma
assimetria_ar <- skewness(dados$VRefAr)
curtose_ar <- kurtosis(dados$VRefAr) + 3

cat("\nMEDIDAS DE FORMA:\n")
cat(sprintf("Assimetria: %.4f\n", assimetria_ar))
cat(sprintf("Curtose: %.4f\n", curtose_ar))

# Histograma VRefAr
png("Histograma_VRefAr.png", width=1000, height=700, res=120)
hist(dados$VRefAr,
     main="Histograma - Valores de Referencia de Arrendamento",
     xlab="Valor de Arrendamento (euros/m2)",
     ylab="Frequencia Absoluta",
     col="lightcoral",
     border="darkred",
     breaks=15)
abline(v=media_ar, col="red", lwd=2, lty=2)
abline(v=mediana_ar, col="green", lwd=2, lty=2)
legend("topright", 
       legend=c(paste("Media =", round(media_ar, 2)), 
                paste("Mediana =", round(mediana_ar, 2))),
       col=c("red", "green"), lwd=2, lty=2)
dev.off()

# Boxplot VRefAr
png("Boxplot_VRefAr.png", width=600, height=800, res=120)
boxplot(dados$VRefAr,
        main="Diagrama de Extremos e Quartis\nValor de Referencia de Arrendamento",
        ylab="Valor de Arrendamento (euros/m2)",
        col="lightcoral",
        border="darkred")
abline(h=media_ar, col="orange", lwd=2, lty=3)
legend("topright", 
       legend=paste("Media =", round(media_ar, 2)),
       col="orange", lwd=2, lty=3)
dev.off()

# ============================================================================
# 5. ANALISE DO NUMERO DE NUCLEOS PRECARIOS
# ============================================================================

cat("\n=== NUMERO DE NUCLEOS PRECARIOS ===\n")

media_nucleos <- mean(dados$n_Nucleos)
mediana_nucleos <- median(dados$n_Nucleos)
moda_nucleos <- as.numeric(names(sort(table(dados$n_Nucleos), decreasing=TRUE)[1]))
desvio_padrao_nucleos <- sd(dados$n_Nucleos)
cv_nucleos <- (desvio_padrao_nucleos / media_nucleos) * 100

cat(sprintf("Media: %.2f nucleos\n", media_nucleos))
cat(sprintf("Mediana: %.2f nucleos\n", mediana_nucleos))
cat(sprintf("Moda: %.0f nucleos\n", moda_nucleos))
cat(sprintf("Desvio Padrao: %.2f nucleos\n", desvio_padrao_nucleos))
cat(sprintf("Coeficiente de Variacao: %.2f%%\n", cv_nucleos))

png("Grafico_nNucleos.png", width=1000, height=600, res=120)
freq_nucleos <- sort(table(dados$n_Nucleos), decreasing=TRUE)[1:20]
barplot(freq_nucleos,
        main="Distribuicao do Numero de Nucleos Precarios\n(20 valores mais frequentes)",
        xlab="Numero de Nucleos Precarios",
        ylab="Frequencia Absoluta",
        col="gold",
        border="black")
dev.off()

# ============================================================================
# 6. COMPARACAO ENTRE REGIOES
# ============================================================================

cat("\n=== COMPARACAO ENTRE REGIOES ===\n")

# VRefAq por regiao
norte_aq <- dados$VRefAq[dados$NUTS_II == "Norte"]
centro_aq <- dados$VRefAq[dados$NUTS_II == "Centro"]

cat("\nVRefAq - REGIAO NORTE:\n")
cat(sprintf("  Media: %.2f euros/m2\n", mean(norte_aq)))
cat(sprintf("  Mediana: %.2f euros/m2\n", median(norte_aq)))
cat(sprintf("  Desvio Padrao: %.2f euros/m2\n", sd(norte_aq)))

cat("\nVRefAq - REGIAO CENTRO:\n")
cat(sprintf("  Media: %.2f euros/m2\n", mean(centro_aq)))
cat(sprintf("  Mediana: %.2f euros/m2\n", median(centro_aq)))
cat(sprintf("  Desvio Padrao: %.2f euros/m2\n", sd(centro_aq)))

png("Boxplot_VRefAq_Regiao.png", width=800, height=700, res=120)
boxplot(VRefAq ~ NUTS_II, data=dados,
        main="Comparacao dos Valores de Aquisicao entre Regioes",
        xlab="Regiao (NUTS II)",
        ylab="Valor de Aquisicao (euros/m2)",
        col=c("lightgreen", "skyblue"),
        border=c("darkgreen", "darkblue"),
        names=c("Centro", "Norte"))
dev.off()

# VRefAr por regiao
norte_ar <- dados$VRefAr[dados$NUTS_II == "Norte"]
centro_ar <- dados$VRefAr[dados$NUTS_II == "Centro"]

cat("\nVRefAr - REGIAO NORTE:\n")
cat(sprintf("  Media: %.2f euros/m2\n", mean(norte_ar)))
cat(sprintf("  Mediana: %.2f euros/m2\n", median(norte_ar)))
cat(sprintf("  Desvio Padrao: %.2f euros/m2\n", sd(norte_ar)))

cat("\nVRefAr - REGIAO CENTRO:\n")
cat(sprintf("  Media: %.2f euros/m2\n", mean(centro_ar)))
cat(sprintf("  Mediana: %.2f euros/m2\n", median(centro_ar)))
cat(sprintf("  Desvio Padrao: %.2f euros/m2\n", sd(centro_ar)))

png("Boxplot_VRefAr_Regiao.png", width=800, height=700, res=120)
boxplot(VRefAr ~ NUTS_II, data=dados,
        main="Comparacao dos Valores de Arrendamento entre Regioes",
        xlab="Regiao (NUTS II)",
        ylab="Valor de Arrendamento (euros/m2)",
        col=c("lightgreen", "skyblue"),
        border=c("darkgreen", "darkblue"),
        names=c("Centro", "Norte"))
dev.off()

# ============================================================================
# 7. CORRELACAO ENTRE VRefAq E VRefAr
# ============================================================================

cat("\n=== CORRELACAO ENTRE VRefAq E VRefAr ===\n")

correlacao <- cor(dados$VRefAq, dados$VRefAr, method="pearson")
cat(sprintf("Coeficiente de Correlacao de Pearson: %.4f\n", correlacao))

if (abs(correlacao) > 0.7) {
  cat("Interpretacao: Correlacao FORTE\n")
} else if (abs(correlacao) > 0.3) {
  cat("Interpretacao: Correlacao MODERADA\n")
} else {
  cat("Interpretacao: Correlacao FRACA\n")
}

png("Diagrama_Dispersao_VRefAq_VRefAr.png", width=1000, height=800, res=120)
plot(dados$VRefAq, dados$VRefAr,
     main="Diagrama de Dispersao\nRelacao entre Valores de Aquisicao e Arrendamento",
     xlab="Valor de Aquisicao (euros/m2)",
     ylab="Valor de Arrendamento (euros/m2)",
     pch=19,
     col=rgb(0, 0, 1, 0.5),
     cex=1.2)
abline(lm(dados$VRefAr ~ dados$VRefAq), col="red", lwd=2)
legend("topleft", 
       legend=paste("r =", round(correlacao, 4)),
       bty="n",
       cex=1.2)
dev.off()

# ============================================================================
# 8. RESUMO FINAL
# ============================================================================

cat("\n=== RESUMO ESTATISTICO COMPLETO ===\n")

cat("\nVRefAq (Aquisicao):\n")
cat(sprintf("  Media: %.2f | Mediana: %.2f | DP: %.2f | CV: %.2f%%\n",
            media_aq, mediana_aq, desvio_padrao_aq, cv_aq))
cat(sprintf("  Assimetria: %.4f | Curtose: %.4f\n", assimetria_aq, curtose_aq))

cat("\nVRefAr (Arrendamento):\n")
cat(sprintf("  Media: %.2f | Mediana: %.2f | DP: %.2f | CV: %.2f%%\n",
            media_ar, mediana_ar, desvio_padrao_ar, cv_ar))
cat(sprintf("  Assimetria: %.4f | Curtose: %.4f\n", assimetria_ar, curtose_ar))

cat("\nComparacao Regional - VRefAq:\n")
cat(sprintf("  Norte: Media=%.2f, DP=%.2f\n", mean(norte_aq), sd(norte_aq)))
cat(sprintf("  Centro: Media=%.2f, DP=%.2f\n", mean(centro_aq), sd(centro_aq)))

cat("\nComparacao Regional - VRefAr:\n")
cat(sprintf("  Norte: Media=%.2f, DP=%.2f\n", mean(norte_ar), sd(norte_ar)))
cat(sprintf("  Centro: Media=%.2f, DP=%.2f\n", mean(centro_ar), sd(centro_ar)))

cat(sprintf("\nCorrelacao VRefAq-VRefAr: %.4f\n", correlacao))

cat("\nANALISE CONCLUIDA COM SUCESSO!\n")
