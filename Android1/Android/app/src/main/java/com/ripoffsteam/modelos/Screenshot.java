package com.ripoffsteam.modelos;

import com.google.gson.annotations.SerializedName;

public class Screenshot {
    @SerializedName("id")
    private int id;

    @SerializedName("image")
    private String image;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getImage() {
        return image != null ? image : "";
    }

    public void setImage(String image) {
        this.image = image;
    }
}