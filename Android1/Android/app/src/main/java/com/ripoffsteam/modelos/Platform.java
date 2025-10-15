package com.ripoffsteam.modelos;

import com.google.gson.annotations.SerializedName;

public class Platform {
    @SerializedName("platform")
    private PlatformDetail platform;

    public String getName() {
        return platform != null ? platform.getName() : "";
    }

    public PlatformDetail getPlatform() {
        return platform;
    }

    public void setPlatform(PlatformDetail platform) {
        this.platform = platform;
    }

    public static class PlatformDetail {
        @SerializedName("id")
        private int id;

        @SerializedName("name")
        private String name;

        @SerializedName("slug")
        private String slug;

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
    }
}
