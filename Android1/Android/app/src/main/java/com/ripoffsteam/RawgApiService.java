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
 * Interface para a API RAWG.io - ATUALIZADA
 * Agora inclui endpoints para buscar descrições completas
 * Documentação: https://api.rawg.io/docs/
 */
public interface RawgApiService {

    /**
     * Obtém lista de jogos com filtros opcionais
     * NOTA: Este endpoint retorna descrições básicas
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
     * PRINCIPAL ENDPOINT: Obtém detalhes COMPLETOS de um jogo específico
     * Este endpoint retorna description_raw (descrição completa)
     * É usado para obter informações detalhadas sobre um jogo
     */
    @GET("games/{id}")
    Call<GameRawg> getGameDetails(
            @Path("id") int gameId,
            @Query("key") String apiKey
    );

    /**
     * NOVO: Obtém detalhes completos de um jogo por slug
     * Alternativa ao endpoint por ID
     */
    @GET("games/{slug}")
    Call<GameRawg> getGameDetailsBySlug(
            @Path("slug") String gameSlug,
            @Query("key") String apiKey
    );

    /**
     * Pesquisa jogos por termo
     * NOTA: Retorna dados básicos, sem description_raw
     */
    @GET("games")
    Call<GameRawgResponse> searchGames(
            @Query("key") String apiKey,
            @Query("search") String query,
            @Query("page_size") int pageSize
    );

    /**
     * NOVO: Pesquisa detalhada de jogos
     * Inclui parâmetros adicionais para busca mais precisa
     */
    @GET("games")
    Call<GameRawgResponse> searchGamesDetailed(
            @Query("key") String apiKey,
            @Query("search") String query,
            @Query("page_size") int pageSize,
            @Query("search_precise") boolean searchPrecise,
            @Query("search_exact") boolean searchExact
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
     * Para obter descrições completas, use getGameDetails() para cada jogo individual
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
     * NOVO: Obtém screenshots de um jogo
     * Útil para enriquecer a apresentação do jogo
     */
    @GET("games/{id}/screenshots")
    Call<Object> getGameScreenshots(
            @Path("id") int gameId,
            @Query("key") String apiKey
    );

    /**
     * NOVO: Obtém jogos similares
     * Pode ser usado para recomendações
     */
    @GET("games/{id}/suggested")
    Call<GameRawgResponse> getSimilarGames(
            @Path("id") int gameId,
            @Query("key") String apiKey
    );

    /**
     * NOVO: Obtém reviews de um jogo
     * Para mostrar opiniões da comunidade
     */
    @GET("games/{id}/reviews")
    Call<Object> getGameReviews(
            @Path("id") int gameId,
            @Query("key") String apiKey,
            @Query("page_size") int pageSize
    );

    /**
     * NOVO: Obtém informações de achievements de um jogo
     * Para mostrar conquistas disponíveis
     */
    @GET("games/{id}/achievements")
    Call<Object> getGameAchievements(
            @Path("id") int gameId,
            @Query("key") String apiKey
    );

    /**
     * NOVO: Obtém trailers de um jogo
     * Para conteúdo multimídia
     */
    @GET("games/{id}/movies")
    Call<Object> getGameTrailers(
            @Path("id") int gameId,
            @Query("key") String apiKey
    );
}