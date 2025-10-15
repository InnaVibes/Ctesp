package com.ripoffsteam.DA0;

import androidx.room.Dao;
import androidx.room.Delete;
import androidx.room.Insert;
import androidx.room.OnConflictStrategy;
import androidx.room.Query;

import com.ripoffsteam.modelos.Game;
import com.ripoffsteam.modelos.WishlistItem;

import java.util.List;

@Dao
public interface WishlistDao {

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void addToWishlist(WishlistItem item);

    @Delete
    void removeFromWishlist(WishlistItem item);

    @Query("DELETE FROM wishlist WHERE gameId = :gameId")
    void removeByGameId(String gameId);

    @Query("SELECT * FROM wishlist")
    List<WishlistItem> getAllWishlistItems();

    @Query("SELECT COUNT(*) FROM wishlist WHERE gameId = :gameId")
    int isInWishlist(String gameId);

    @Query("SELECT g.* FROM games g INNER JOIN wishlist w ON g.id = w.gameId ORDER BY w.dateAdded DESC")
    List<Game> getWishlistGames();
}