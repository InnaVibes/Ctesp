package com.ripoffsteam.modelos;

import com.google.gson.annotations.SerializedName;
import java.util.List;
import java.util.ArrayList;

/**
 * Modelo exclusivo para receber dados da API RAWG
 * ATUALIZADO: Agora usa description_raw para descrições completas
 * NÃO é usado no Room Database
 */
public class GameRawg {

    @SerializedName("id")
    private int id;

    @SerializedName("name")
    private String name;

    @SerializedName("name_original")
    private String nameOriginal;

    // PRINCIPAL MUDANÇA: Campo para descrição completa do jogo
    @SerializedName("description_raw")
    private String descriptionRaw;

    // Fallback para descrição básica (caso description_raw não esteja disponível)
    @SerializedName("description")
    private String description;

    @SerializedName("rating")
    private float rating;

    @SerializedName("rating_top")
    private float ratingTop;

    @SerializedName("background_image")
    private String backgroundImage;

    @SerializedName("background_image_additional")
    private String backgroundImageAdditional;

    @SerializedName("website")
    private String website;

    @SerializedName("metacritic")
    private Integer metacritic;

    @SerializedName("metacritic_url")
    private String metacriticUrl;

    @SerializedName("released")
    private String released;

    @SerializedName("tba")
    private boolean tba;

    @SerializedName("updated")
    private String updated;

    @SerializedName("playtime")
    private int playtime;

    @SerializedName("achievements_count")
    private int achievementsCount;

    @SerializedName("reddit_url")
    private String redditUrl;

    @SerializedName("reddit_name")
    private String redditName;

    @SerializedName("reddit_description")
    private String redditDescription;

    @SerializedName("platforms")
    private List<Platform> platforms;

    @SerializedName("genres")
    private List<Genre> genres;

    @SerializedName("stores")
    private List<Store> stores;

    @SerializedName("developers")
    private List<Developer> developers;

    @SerializedName("publishers")
    private List<Publisher> publishers;

    @SerializedName("short_screenshots")
    private List<Screenshot> shortScreenshots;

    @SerializedName("tags")
    private List<Tag> tags;

    @SerializedName("esrb_rating")
    private EsrbRating esrbRating;

    // Classes internas para estruturas complexas
    public static class EsrbRating {
        @SerializedName("id")
        private int id;

        @SerializedName("name")
        private String name;

        @SerializedName("slug")
        private String slug;

        public int getId() { return id; }
        public String getName() { return name != null ? name : ""; }
        public String getSlug() { return slug != null ? slug : ""; }
    }

    public static class Tag {
        @SerializedName("id")
        private int id;

        @SerializedName("name")
        private String name;

        @SerializedName("slug")
        private String slug;

        public int getId() { return id; }
        public String getName() { return name != null ? name : ""; }
        public String getSlug() { return slug != null ? slug : ""; }
    }

    public static class Publisher {
        @SerializedName("id")
        private int id;

        @SerializedName("name")
        private String name;

        @SerializedName("slug")
        private String slug;

        public int getId() { return id; }
        public String getName() { return name != null ? name : ""; }
        public String getSlug() { return slug != null ? slug : ""; }
    }

    // Construtores
    public GameRawg() {}

    // Getters e Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getNameOriginal() {
        return nameOriginal;
    }

    public void setNameOriginal(String nameOriginal) {
        this.nameOriginal = nameOriginal;
    }

    /**
     * MÉTODO PRINCIPAL: Obtém a descrição completa do jogo
     * Prioriza description_raw, fallback para description
     */
    public String getDescriptionRaw() {
        return descriptionRaw;
    }

    public void setDescriptionRaw(String descriptionRaw) {
        this.descriptionRaw = descriptionRaw;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    /**
     * Obtém a melhor descrição disponível
     * @return description_raw se disponível, senão description, senão texto padrão
     */
    public String getBestDescription() {
        // Prioridade 1: description_raw (descrição completa)
        if (descriptionRaw != null && !descriptionRaw.trim().isEmpty()) {
            return descriptionRaw.trim();
        }

        // Prioridade 2: description (descrição básica)
        if (description != null && !description.trim().isEmpty()) {
            return description.trim();
        }

        // Fallback: Criar descrição básica com informações disponíveis
        StringBuilder fallbackDesc = new StringBuilder();

        if (name != null) {
            fallbackDesc.append(name);
        }

        if (released != null && !released.isEmpty()) {
            fallbackDesc.append(" foi lançado em ").append(released);
        }

        if (developers != null && !developers.isEmpty() && developers.get(0) != null) {
            fallbackDesc.append(" pela ").append(developers.get(0).getName());
        }

        if (fallbackDesc.length() > 0) {
            fallbackDesc.append(".");
            return fallbackDesc.toString();
        }

        return "Informações sobre este jogo não estão disponíveis no momento.";
    }

    public float getRating() {
        return rating;
    }

    public void setRating(float rating) {
        this.rating = rating;
    }

    public float getRatingTop() {
        return ratingTop;
    }

    public void setRatingTop(float ratingTop) {
        this.ratingTop = ratingTop;
    }

    public String getBackgroundImage() {
        return backgroundImage;
    }

    public void setBackgroundImage(String backgroundImage) {
        this.backgroundImage = backgroundImage;
    }

    public String getBackgroundImageAdditional() {
        return backgroundImageAdditional;
    }

    public void setBackgroundImageAdditional(String backgroundImageAdditional) {
        this.backgroundImageAdditional = backgroundImageAdditional;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public Integer getMetacritic() {
        return metacritic;
    }

    public void setMetacritic(Integer metacritic) {
        this.metacritic = metacritic;
    }

    public String getMetacriticUrl() {
        return metacriticUrl;
    }

    public void setMetacriticUrl(String metacriticUrl) {
        this.metacriticUrl = metacriticUrl;
    }

    public String getReleased() {
        return released;
    }

    public void setReleased(String released) {
        this.released = released;
    }

    public boolean isTba() {
        return tba;
    }

    public void setTba(boolean tba) {
        this.tba = tba;
    }

    public String getUpdated() {
        return updated;
    }

    public void setUpdated(String updated) {
        this.updated = updated;
    }

    public int getPlaytime() {
        return playtime;
    }

    public void setPlaytime(int playtime) {
        this.playtime = playtime;
    }

    public int getAchievementsCount() {
        return achievementsCount;
    }

    public void setAchievementsCount(int achievementsCount) {
        this.achievementsCount = achievementsCount;
    }

    public String getRedditUrl() {
        return redditUrl;
    }

    public void setRedditUrl(String redditUrl) {
        this.redditUrl = redditUrl;
    }

    public String getRedditName() {
        return redditName;
    }

    public void setRedditName(String redditName) {
        this.redditName = redditName;
    }

    public String getRedditDescription() {
        return redditDescription;
    }

    public void setRedditDescription(String redditDescription) {
        this.redditDescription = redditDescription;
    }

    public List<Platform> getPlatforms() {
        return platforms;
    }

    public void setPlatforms(List<Platform> platforms) {
        this.platforms = platforms;
    }

    public List<Genre> getGenres() {
        return genres;
    }

    public void setGenres(List<Genre> genres) {
        this.genres = genres;
    }

    public List<Store> getStores() {
        return stores;
    }

    public void setStores(List<Store> stores) {
        this.stores = stores;
    }

    public List<Developer> getDevelopers() {
        return developers;
    }

    public void setDevelopers(List<Developer> developers) {
        this.developers = developers;
    }

    public List<Publisher> getPublishers() {
        return publishers;
    }

    public void setPublishers(List<Publisher> publishers) {
        this.publishers = publishers;
    }

    public List<Screenshot> getShortScreenshots() {
        return shortScreenshots;
    }

    public void setShortScreenshots(List<Screenshot> shortScreenshots) {
        this.shortScreenshots = shortScreenshots;
    }

    public List<Tag> getTags() {
        return tags;
    }

    public void setTags(List<Tag> tags) {
        this.tags = tags;
    }

    public EsrbRating getEsrbRating() {
        return esrbRating;
    }

    public void setEsrbRating(EsrbRating esrbRating) {
        this.esrbRating = esrbRating;
    }

    /**
     * MÉTODO ATUALIZADO: Converte GameRawg para Game (modelo do Room)
     * Agora usa a descrição completa da API
     */
    public Game toGame() {
        // Processa plataformas
        List<String> platformNames = new ArrayList<>();
        if (platforms != null) {
            for (Platform platform : platforms) {
                if (platform != null && platform.getName() != null) {
                    platformNames.add(platform.getName());
                }
            }
        }

        // Processa géneros
        List<String> genreNames = new ArrayList<>();
        if (genres != null) {
            for (Genre genre : genres) {
                if (genre != null && genre.getName() != null) {
                    genreNames.add(genre.getName());
                }
            }
        }

        // Processa lojas
        List<String> storeNames = new ArrayList<>();
        if (stores != null) {
            for (Store store : stores) {
                if (store != null && store.getName() != null) {
                    storeNames.add(store.getName());
                }
            }
        }

        // Processa screenshots
        List<String> screenshotUrls = new ArrayList<>();
        if (shortScreenshots != null) {
            for (Screenshot screenshot : shortScreenshots) {
                if (screenshot != null && screenshot.getImage() != null) {
                    screenshotUrls.add(screenshot.getImage());
                }
            }
        }

        // Processa developer (studio) - Prioriza publisher se disponível
        String studio = "Unknown Developer";
        if (publishers != null && !publishers.isEmpty()) {
            Publisher firstPublisher = publishers.get(0);
            if (firstPublisher != null && firstPublisher.getName() != null) {
                studio = firstPublisher.getName();
            }
        } else if (developers != null && !developers.isEmpty()) {
            Developer firstDev = developers.get(0);
            if (firstDev != null && firstDev.getName() != null) {
                studio = firstDev.getName();
            }
        }

        // PRINCIPAL MUDANÇA: Usa a descrição completa
        String processedDescription = getBestDescription();

        // Limita tamanho se necessário (para evitar problemas de performance)
        if (processedDescription.length() > 2000) {
            processedDescription = processedDescription.substring(0, 1997) + "...";
        }

        // BONUS: Adiciona informações extras se a descrição for muito curta
        if (processedDescription.length() < 100) {
            StringBuilder enhancedDesc = new StringBuilder(processedDescription);

            if (metacritic != null && metacritic > 0) {
                enhancedDesc.append("\n\nPontuação Metacritic: ").append(metacritic).append("/100");
            }

            if (playtime > 0) {
                enhancedDesc.append("\nTempo médio de jogo: ").append(playtime).append(" horas");
            }

            if (achievementsCount > 0) {
                enhancedDesc.append("\nConquistas disponíveis: ").append(achievementsCount);
            }

            processedDescription = enhancedDesc.toString();
        }

        // Cria Game para Room
        return new Game(
                String.valueOf(id),
                name != null ? name : "Unknown Game",
                processedDescription,
                studio,
                platformNames,
                genreNames,
                storeNames,
                rating,
                backgroundImage != null ? backgroundImage : "",
                screenshotUrls
        );
    }
}