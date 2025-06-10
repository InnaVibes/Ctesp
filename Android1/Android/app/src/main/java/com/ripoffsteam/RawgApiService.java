package com.ripoffsteam;

import com.ripoffsteam.modelos.GameRawg;
import com.ripoffsteam.modelos.GameRawgResponse;
import com.ripoffsteam.modelos.GenresResponse;
import com.ripoffsteam.modelos.PlatformsResponse;
import com.ripoffsteam.modelos.StoresResponse;
import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Path;
import retrofit2.http.Query;

/**
 * Interface para a API RAWG.io - CORRIGIDA
 * Documentação: https://api.rawg.io/docs/
 */
public interface RawgApiService {

    /**
     * Obtém lista de jogos com filtros opcionais
     */
    @GET("games")
    Call<GameRawgResponse> getGames(
            @Query("key") String apiKey,
            @Query("page") int page,
            @Query("page_size") int pageSize,
            @Query("genres") String genres,
            @Query("platforms") String platforms
    );

    /**
     * Obtém detalhes específicos de um jogo
     */
    @GET("games/{id}")
    Call<GameRawg> getGameDetails(
            @Path("id") int gameId,
            @Query("key") String apiKey
    );

    /**
     * Pesquisa jogos por termo
     */
    @GET("games")
    Call<GameRawgResponse> searchGames(
            @Query("key") String apiKey,
            @Query("search") String query,
            @Query("page_size") int pageSize
    );

    /**
     * Obtém lista de géneros disponíveis
     */
    @GET("genres")
    Call<GenresResponse> getGenres(@Query("key") String apiKey);

    /**
     * Obtém lista de plataformas disponíveis
     */
    @GET("platforms")
    Call<PlatformsResponse> getPlatforms(
            @Query("key") String apiKey,
            @Query("ordering") String ordering
    );

    /**
     * Obtém lista de plataformas simples
     */
    @GET("platforms")
    Call<PlatformsResponse> getPlatforms(@Query("key") String apiKey);

    /**
     * Obtém lista de lojas disponíveis
     */
    @GET("stores")
    Call<StoresResponse> getStores(
            @Query("key") String apiKey,
            @Query("ordering") String ordering
    );

    /**
     * Obtém lista de lojas simples
     */
    @GET("stores")
    Call<StoresResponse> getStores(@Query("key") String apiKey);

    /**
     * Obtém jogos populares (mais bem avaliados)
     */
    @GET("games")
    Call<GameRawgResponse> getPopularGames(
            @Query("key") String apiKey,
            @Query("ordering") String ordering, // "-rating"
            @Query("page_size") int pageSize
    );

    /**
     * Obtém jogos recentes
     */
    @GET("games")
    Call<GameRawgResponse> getRecentGames(
            @Query("key") String apiKey,
            @Query("ordering") String ordering, // "-released"
            @Query("page_size") int pageSize,
            @Query("dates") String dates
    );

    /**
     * Obtém jogos de um género específico
     */
    @GET("games")
    Call<GameRawgResponse> getGamesByGenre(
            @Query("key") String apiKey,
            @Query("genres") String genreId,
            @Query("page_size") int pageSize,
            @Query("ordering") String ordering
    );

    /**
     * Obtém jogos de uma plataforma específica
     */
    @GET("games")
    Call<GameRawgResponse> getGamesByPlatform(
            @Query("key") String apiKey,
            @Query("platforms") String platformId,
            @Query("page_size") int pageSize,
            @Query("ordering") String ordering
    );

    /**
     * Obtém screenshots de um jogo
     */
    @GET("games/{id}/screenshots")
    Call<Object> getGameScreenshots(
            @Path("id") int gameId,
            @Query("key") String apiKey
    );

    /**
     * Obtém jogos similares
     */
    @GET("games/{id}/suggested")
    Call<GameRawgResponse> getSimilarGames(
            @Path("id") int gameId,
            @Query("key") String apiKey
    );
}