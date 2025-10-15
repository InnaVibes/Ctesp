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

/**
 * Base de dados principal da aplicação
 * Versão simplificada para resolver conflitos de serialização
 */
@Database(
        entities = {Game.class, WishlistItem.class},
        version = 4,  // Incrementada para limpar problemas anteriores
        exportSchema = false
)
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
                            .fallbackToDestructiveMigration() // Para resolver problemas de migração
                            .build();
                }
            }
        }
        return INSTANCE;
    }

    /**
     * Versão para desenvolvimento que sempre recria a base de dados
     */
    public static AppDatabase getDevInstance(Context context) {
        synchronized (AppDatabase.class) {
            if (INSTANCE != null) {
                INSTANCE.close();
            }

            INSTANCE = Room.databaseBuilder(
                            context.getApplicationContext(),
                            AppDatabase.class,
                            "games_db_dev")
                    .fallbackToDestructiveMigration()
                    .build();

            return INSTANCE;
        }
    }

    /**
     * Versão para testes que usa base de dados em memória
     */
    public static AppDatabase getTestInstance(Context context) {
        return Room.inMemoryDatabaseBuilder(
                        context.getApplicationContext(),
                        AppDatabase.class)
                .allowMainThreadQueries()
                .build();
    }

    /**
     * Fecha a base de dados
     */
    public static void closeDatabase() {
        if (INSTANCE != null) {
            INSTANCE.close();
            INSTANCE = null;
        }
    }

    /**
     * Verifica se a base de dados está aberta
     */
    public static boolean isDatabaseOpen() {
        return INSTANCE != null && INSTANCE.isOpen();
    }

    /**
     * Executa uma query de limpeza (para manutenção)
     */
    public void vacuum() {
        try {
            getOpenHelper().getWritableDatabase().execSQL("VACUUM");
        } catch (Exception e) {
            android.util.Log.e("AppDatabase", "Erro ao executar VACUUM", e);
        }
    }

    /**
     * Obtém estatísticas da base de dados
     */
    public DatabaseStats getStats() {
        try {
            int totalGames = gameDao().getAll().size();
            int totalWishlist = wishlistDao().getAllWishlistItems().size();

            return new DatabaseStats(totalGames, totalWishlist);
        } catch (Exception e) {
            return new DatabaseStats(0, 0);
        }
    }

    /**
     * Classe para estatísticas da base de dados
     */
    public static class DatabaseStats {
        public final int totalGames;
        public final int totalWishlistItems;

        public DatabaseStats(int totalGames, int totalWishlistItems) {
            this.totalGames = totalGames;
            this.totalWishlistItems = totalWishlistItems;
        }

        @Override
        public String toString() {
            return String.format("DB Stats: %d jogos, %d na wishlist", totalGames, totalWishlistItems);
        }
    }
}