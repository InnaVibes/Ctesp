package com.ripoffsteam.DataBase;

import androidx.room.Database;
import androidx.room.Room;
import androidx.room.RoomDatabase;
import android.content.Context;

import com.ripoffsteam.DA0.GameDao;
import com.ripoffsteam.modelos.Game;


@Database(entities = {Game.class}, version = 1)
public abstract class AppDatabase extends RoomDatabase {
    //Metodo abstrato para obter o DAO dos jogos.


    public abstract GameDao gameDao();

    private static volatile AppDatabase INSTANCE;

    public static AppDatabase getInstance(Context context) {
        // Verificação dupla para thread safety
        if (INSTANCE == null) {
            synchronized (AppDatabase.class) {
                if (INSTANCE == null) {
                    // Cria a base de dados com as configurações necessárias
                    INSTANCE = Room.databaseBuilder(
                                    context.getApplicationContext(),
                                    AppDatabase.class,
                                    "games_db")
                            .allowMainThreadQueries() // Permite queries na thread principal (não recomendado tal como descrito nos slides)
                            .build();
                }
            }
        }
        return INSTANCE;
    }
}