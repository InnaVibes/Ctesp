package com.ripoffsteam.modelos;

import androidx.annotation.NonNull;
import androidx.room.Entity;
import androidx.room.PrimaryKey;

@Entity(tableName = "wishlist")
public class WishlistItem {

    @PrimaryKey
    @NonNull  // ADICIONAR ESTA ANOTAÇÃO
    private String gameId;
    private long dateAdded;

    public WishlistItem(@NonNull String gameId, long dateAdded) {
        this.gameId = gameId;
        this.dateAdded = dateAdded;
    }

    // Getters and setters
    @NonNull
    public String getGameId() {
        return gameId;
    }

    public void setGameId(@NonNull String gameId) {
        this.gameId = gameId;
    }

    public long getDateAdded() {
        return dateAdded;
    }

    public void setDateAdded(long dateAdded) {
        this.dateAdded = dateAdded;
    }
}