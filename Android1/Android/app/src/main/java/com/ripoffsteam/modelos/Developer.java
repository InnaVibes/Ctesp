package com.ripoffsteam.modelos;

import com.google.gson.annotations.SerializedName;

public class Developer {
    @SerializedName("id")
    private int id;

    @SerializedName("name")
    private String name;

    @SerializedName("slug")
    private String slug;

    @SerializedName("games_count")
    private int gamesCount;

    @SerializedName("image_background")
    private String imageBackground;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name != null ? name : "";
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSlug() {
        return slug != null ? slug : "";
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public int getGamesCount() {
        return gamesCount;
    }

    public void setGamesCount(int gamesCount) {
        this.gamesCount = gamesCount;
    }

    public String getImageBackground() {
        return imageBackground != null ? imageBackground : "";
    }

    public void setImageBackground(String imageBackground) {
        this.imageBackground = imageBackground;
    }
}
