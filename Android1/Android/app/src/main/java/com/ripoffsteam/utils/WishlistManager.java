package com.ripoffsteam.utils;

import android.content.Context;
import com.ripoffsteam.DataBase.AppDatabase;
import com.ripoffsteam.modelos.Game;
import com.ripoffsteam.modelos.WishlistItem;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Executors;

public class WishlistManager {
    private static WishlistManager instance;
    private Context context;
    private List<Game> wishlistGames = new ArrayList<>();

    private WishlistManager(Context context) {
        this.context = context.getApplicationContext();
        loadWishlistFromDatabase();
    }

    public static WishlistManager getInstance(Context context) {
        if (instance == null) {
            instance = new WishlistManager(context);
        }
        return instance;
    }

    public static WishlistManager getInstance() {
        if (instance == null) {
            throw new IllegalStateException("WishlistManager not initialized. Call getInstance(Context) first.");
        }
        return instance;
    }

    private void loadWishlistFromDatabase() {
        Executors.newSingleThreadExecutor().execute(() -> {
            AppDatabase db = AppDatabase.getInstance(context);
            List<Game> games = db.wishlistDao().getWishlistGames();
            wishlistGames.clear();
            wishlistGames.addAll(games);
        });
    }

    public boolean isInWishlist(Game game) {
        return wishlistGames.stream()
                .anyMatch(g -> g.getId().equals(game.getId()));
    }

    public void addToWishlist(Game game) {
        if (!isInWishlist(game)) {
            wishlistGames.add(game);

            // Save to database
            Executors.newSingleThreadExecutor().execute(() -> {
                AppDatabase db = AppDatabase.getInstance(context);
                WishlistItem item = new WishlistItem(game.getId(), System.currentTimeMillis());
                db.wishlistDao().addToWishlist(item);
            });
        }
    }

    public void removeFromWishlist(Game game) {
        wishlistGames.removeIf(g -> g.getId().equals(game.getId()));

        // Remove from database
        Executors.newSingleThreadExecutor().execute(() -> {
            AppDatabase db = AppDatabase.getInstance(context);
            db.wishlistDao().removeByGameId(game.getId());
        });
    }

    public List<Game> getWishlist() {
        return new ArrayList<>(wishlistGames);
    }

    public void refreshFromDatabase() {
        loadWishlistFromDatabase();
    }
}