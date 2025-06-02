package com.ripoffsteam.DA0;

import androidx.room.Dao;
import androidx.room.Delete;
import androidx.room.Insert;
import androidx.room.OnConflictStrategy;
import androidx.room.Query;
import androidx.room.Update;
import com.ripoffsteam.modelos.Game;
import java.util.List;

@Dao
public interface GameDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insertAll(List<Game> games);

    // Atualiza um jogo existente
    @Update
    void update(Game game);

    // Apaga um jogo
    @Delete
    void delete(Game game);

    // Obtém todos os jogos
    @Query("SELECT * FROM games") // Certifique-se de que ‘games’ é o nome correto da tabela
    List<Game> getAll();

    // Pesquisa jogos pelo nome
    @Query("SELECT * FROM games WHERE name LIKE :search")
    List<Game> findGameWithName(String search);

    // Obtém apenas um jogo pelo nome
    @Query("SELECT * FROM games WHERE name LIKE :name LIMIT 1")
    Game findGameByName(String name);
    // Obtém apenas um jogo pelo ID
    @Query("SELECT * FROM games WHERE id = :id LIMIT 1")
    Game findGameById(String id);
    // Obtém todos os jogos por género
    @Query("SELECT * FROM games WHERE genres LIKE '%' || :genre || '%'")
    List<Game> getGamesByGenre(String genre);

    // Obetém todos os jogos por plataforma
    @Query("SELECT * FROM games WHERE platforms LIKE '%' || :platform || '%'")
    List<Game> getGamesByPlatform(String platform);


    // Filtra pelos 2 parametros
    @Query("SELECT * FROM games " +
            "WHERE (:genre IS NULL OR genres LIKE '%' || :genre || '%') " +
            "AND (:platform IS NULL OR platforms LIKE '%' || :platform || '%') ")
    List<Game> getFilteredGames(String genre, String platform);
}