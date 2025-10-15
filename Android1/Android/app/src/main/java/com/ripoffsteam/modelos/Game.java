package com.ripoffsteam.modelos;

import androidx.annotation.NonNull;
import androidx.room.Entity;
import androidx.room.PrimaryKey;
import androidx.room.TypeConverters;
import com.ripoffsteam.converters.Converters;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Entity(tableName = "games")
@TypeConverters({Converters.class})
public class Game implements Serializable {

    @PrimaryKey
    @NonNull
    private String id;

    private String name;
    private String description;
    private String studio;
    private List<String> platforms;
    private List<String> genres;
    private List<String> stores;
    private float rating;
    private String imageUrl;
    private List<String> screenshots;

    // Construtores
    public Game() {
        this.platforms = new ArrayList<>();
        this.genres = new ArrayList<>();
        this.stores = new ArrayList<>();
        this.screenshots = new ArrayList<>();
    }

    public Game(@NonNull String id, String name, String description, String studio,
                List<String> platforms, List<String> genres, List<String> stores,
                float rating, String imageUrl, List<String> screenshots) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.studio = studio;
        this.platforms = platforms != null ? platforms : new ArrayList<>();
        this.genres = genres != null ? genres : new ArrayList<>();
        this.stores = stores != null ? stores : new ArrayList<>();
        this.rating = rating;
        this.imageUrl = imageUrl;
        this.screenshots = screenshots != null ? screenshots : new ArrayList<>();
    }

    // Getters e Setters
    @NonNull
    public String getId() {
        return id != null ? id : "";
    }

    public void setId(@NonNull String id) {
        this.id = id;
    }

    public String getName() {
        return name != null ? name : "";
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description != null ? description : "";
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStudio() {
        return studio != null ? studio : "";
    }

    public void setStudio(String studio) {
        this.studio = studio;
    }

    public List<String> getPlatforms() {
        return platforms != null ? platforms : new ArrayList<>();
    }

    public void setPlatforms(List<String> platforms) {
        this.platforms = platforms;
    }

    public List<String> getGenres() {
        return genres != null ? genres : new ArrayList<>();
    }

    public void setGenres(List<String> genres) {
        this.genres = genres;
    }

    public List<String> getStores() {
        return stores != null ? stores : new ArrayList<>();
    }

    public void setStores(List<String> stores) {
        this.stores = stores;
    }

    public float getRating() {
        return rating;
    }

    public void setRating(float rating) {
        this.rating = rating;
    }

    public String getImageUrl() {
        return imageUrl != null ? imageUrl : "";
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public List<String> getScreenshots() {
        return screenshots != null ? screenshots : new ArrayList<>();
    }

    public void setScreenshots(List<String> screenshots) {
        this.screenshots = screenshots;
    }

    // Métodos auxiliares
    public void addPlatform(String platform) {
        if (platforms == null) {
            platforms = new ArrayList<>();
        }
        if (platform != null && !platforms.contains(platform)) {
            platforms.add(platform);
        }
    }

    public void addGenre(String genre) {
        if (genres == null) {
            genres = new ArrayList<>();
        }
        if (genre != null && !genres.contains(genre)) {
            genres.add(genre);
        }
    }

    public void addStore(String store) {
        if (stores == null) {
            stores = new ArrayList<>();
        }
        if (store != null && !stores.contains(store)) {
            stores.add(store);
        }
    }

    public void addScreenshot(String screenshot) {
        if (screenshots == null) {
            screenshots = new ArrayList<>();
        }
        if (screenshot != null && !screenshots.contains(screenshot)) {
            screenshots.add(screenshot);
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Game game = (Game) o;
        return getId().equals(game.getId());
    }

    @Override
    public int hashCode() {
        return getId().hashCode();
    }

    @Override
    public String toString() {
        return "Game{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", studio='" + studio + '\'' +
                ", rating=" + rating +
                ", platforms=" + (platforms != null ? platforms.size() : 0) +
                ", genres=" + (genres != null ? genres.size() : 0) +
                '}';
    }
}