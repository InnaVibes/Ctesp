package com.ripoffsteam.DataBase;

import androidx.room.Database;
import androidx.room.Room;
import androidx.room.RoomDatabase;
import androidx.room.TypeConverters;
import android.content.Context;

import com.ripoffsteam.DA0.GameDao;
import com.ripoffsteam.DA0.WishlistDao;
import com.ripoffsteam.modelos.Game;
import com.ripoffsteam.modelos.WishlistItem;
import com.ripoffsteam.converters.Converters;

@Database(entities = {Game.class, WishlistItem.class}, version = 2)
@TypeConverters({Converters.class})
public abstract class AppDatabase extends RoomDatabase {

    public abstract GameDao gameDao();
    public abstract WishlistDao wishlistDao();

    private static volatile AppDatabase INSTANCE;

    public static AppDatabase getInstance(Context context) {
        if (INSTANCE == null) {
            synchronized (AppDatabase.class) {
                if (INSTANCE == null) {
                    INSTANCE = Room.databaseBuilder(
                                    context.getApplicationContext(),
                                    AppDatabase.class,
                                    "games_db")
                            .fallbackToDestructiveMigration() // Para desenvolvimento
                            .build();
                }
            }
        }
        return INSTANCE;
    }
}