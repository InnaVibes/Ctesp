package com.ripoffsteam.modelos;

import com.google.gson.annotations.SerializedName;
import java.util.List;
import java.util.ArrayList;


/**
 * Modelo exclusivo para receber dados da API RAWG
 * NÃO é usado no Room Database
 */
public class GameRawg {

    @SerializedName("id")
    private int id;

    @SerializedName("name")
    private String name;

    @SerializedName("description_raw")
    private String description;

    @SerializedName("rating")
    private float rating;

    @SerializedName("background_image")
    private String backgroundImage;

    @SerializedName("platforms")
    private List<Platform> platforms;

    @SerializedName("genres")
    private List<Genre> genres;

    @SerializedName("stores")
    private List<Store> stores;

    @SerializedName("developers")
    private List<Developer> developers;

    @SerializedName("short_screenshots")
    private List<Screenshot> shortScreenshots;

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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public float getRating() {
        return rating;
    }

    public void setRating(float rating) {
        this.rating = rating;
    }

    public String getBackgroundImage() {
        return backgroundImage;
    }

    public void setBackgroundImage(String backgroundImage) {
        this.backgroundImage = backgroundImage;
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

    public List<Screenshot> getShortScreenshots() {
        return shortScreenshots;
    }

    public void setShortScreenshots(List<Screenshot> shortScreenshots) {
        this.shortScreenshots = shortScreenshots;
    }

    /**
     * Converte GameRawg para Game (modelo do Room)
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

        // Processa developer (studio)
        String studio = "Unknown Developer";
        if (developers != null && !developers.isEmpty()) {
            Developer firstDev = developers.get(0);
            if (firstDev != null && firstDev.getName() != null) {
                studio = firstDev.getName();
            }
        }

        // Processa descrição
        String processedDescription = description;
        if (processedDescription == null || processedDescription.trim().isEmpty()) {
            processedDescription = "No description available for this game.";
        } else if (processedDescription.length() > 1000) {
            processedDescription = processedDescription.substring(0, 997) + "...";
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