package com.ripoffsteam;

import com.ripoffsteam.modelos.Game;
import com.ripoffsteam.modelos.GameResponse;
import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Query;
import retrofit2.http.Path;

public interface RawgApiService {

    // Fetch a list of games with optional filters
    @GET("games")
    Call<GameResponse> getGames(
            @Query("key") String apiKey,
            @Query("page") int page,
            @Query("page_size") int pageSize,
            @Query("genres") String genres,
            @Query("platforms") String platforms
    );

    // Fetch details of a specific game by ID
    @GET("games/{id}")
    Call<Game> getGameDetails(
            @Path("id") int gameId,
            @Query("key") String apiKey
    );

    // Search for games by query
    @GET("games")
    Call<GameResponse> searchGames(
            @Query("key") String apiKey,
            @Query("search") String query,
            @Query("page_size") int pageSize
    );
}