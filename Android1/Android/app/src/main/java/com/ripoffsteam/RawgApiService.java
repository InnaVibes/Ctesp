package com.ripoffsteam;

import com.ripoffsteam.modelos.Game;
import com.ripoffsteam.modelos.GameResponse;
import com.ripoffsteam.modelos.GenresResponse;
import com.ripoffsteam.modelos.PlatformsResponse;
import com.ripoffsteam.modelos.StoresResponse;
import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Path;
import retrofit2.http.Query;

/**
 * Interface para a API RAWG.io
 * Documentação: https://api.rawg.io/docs/
 */
public interface RawgApiService {

    /**
     * Obtém lista de jogos com filtros opcionais
     * @param apiKey Chave da API RAWG
     * @param page Número da página (padrão: 1)
     * @param pageSize Número de itens por página (máx: 40)
     * @param genres IDs dos géneros separados por vírgula (ex: "4,51")
     * @param platforms IDs das plataformas separados por vírgula (ex: "4,5")
     * @param stores IDs das lojas separados por vírgula (ex: "1,2")
     * @param developers IDs dos developers separados por vírgula
     * @param publishers IDs dos publishers separados por vírgula
     * @param ordering Ordenação (ex: "-rating", "-added", "name")
     * @param search Termo de pesquisa
     * @return Lista paginada de jogos
     */
    @GET("games")
    Call<GameResponse> getGames(
            @Query("key") String apiKey,
            @Query("page") int page,
            @Query("page_size") int pageSize,
            @Query("genres") String genres,
            @Query("platforms") String platforms,
            @Query("stores") String stores,
            @Query("developers") String developers,
            @Query("publishers") String publishers,
            @Query("ordering") String ordering,
            @Query("search") String search
    );

    /**
     * Obtém lista de jogos simples (sem parâmetros extras)
     * @param apiKey Chave da API
     * @param page Página
     * @param pageSize Tamanho da página
     * @param genres Filtro de géneros
     * @param platforms Filtro de plataformas
     * @return Lista de jogos
     */
    @GET("games")
    Call<GameResponse> getGames(
            @Query("key") String apiKey,
            @Query("page") int page,
            @Query("page_size") int pageSize,
            @Query("genres") String genres,
            @Query("platforms") String platforms
    );

    /**
     * Obtém detalhes específicos de um jogo
     * @param gameId ID do jogo
     * @param apiKey Chave da API
     * @return Detalhes completos do jogo
     */
    @GET("games/{id}")
    Call<Game> getGameDetails(
            @Path("id") int gameId,
            @Query("key") String apiKey
    );

    /**
     * Pesquisa jogos por termo
     * @param apiKey Chave da API
     * @param query Termo de pesquisa
     * @param pageSize Número de resultados
     * @param exact Pesquisa exata (true/false)
     * @return Resultados da pesquisa
     */
    @GET("games")
    Call<GameResponse> searchGames(
            @Query("key") String apiKey,
            @Query("search") String query,
            @Query("page_size") int pageSize,
            @Query("search_exact") boolean exact
    );

    /**
     * Pesquisa simples de jogos
     * @param apiKey Chave da API
     * @param query Termo de pesquisa
     * @param pageSize Número de resultados
     * @return Resultados da pesquisa
     */
    @GET("games")
    Call<GameResponse> searchGames(
            @Query("key") String apiKey,
            @Query("search") String query,
            @Query("page_size") int pageSize
    );

    /**
     * Obtém lista de géneros disponíveis
     * @param apiKey Chave da API
     * @return Lista de géneros
     */
    @GET("genres")
    Call<GenresResponse> getGenres(@Query("key") String apiKey);

    /**
     * Obtém lista de plataformas disponíveis
     * @param apiKey Chave da API
     * @param ordering Ordenação (ex: "name", "-games_count")
     * @return Lista de plataformas
     */
    @GET("platforms")
    Call<PlatformsResponse> getPlatforms(
            @Query("key") String apiKey,
            @Query("ordering") String ordering
    );

    /**
     * Obtém lista de plataformas simples
     * @param apiKey Chave da API
     * @return Lista de plataformas
     */
    @GET("platforms")
    Call<PlatformsResponse> getPlatforms(@Query("key") String apiKey);

    /**
     * Obtém lista de lojas disponíveis
     * @param apiKey Chave da API
     * @param ordering Ordenação
     * @return Lista de lojas
     */
    @GET("stores")
    Call<StoresResponse> getStores(
            @Query("key") String apiKey,
            @Query("ordering") String ordering
    );

    /**
     * Obtém lista de lojas simples
     * @param apiKey Chave da API
     * @return Lista de lojas
     */
    @GET("stores")
    Call<StoresResponse> getStores(@Query("key") String apiKey);

    /**
     * Obtém jogos populares (mais bem avaliados)
     * @param apiKey Chave da API
     * @param pageSize Número de jogos
     * @return Jogos populares
     */
    @GET("games")
    Call<GameResponse> getPopularGames(
            @Query("key") String apiKey,
            @Query("ordering") String ordering, // "-rating"
            @Query("page_size") int pageSize
    );

    /**
     * Obtém jogos recentes
     * @param apiKey Chave da API
     * @param pageSize Número de jogos
     * @param dates Filtro de datas (ex: "2023-01-01,2023-12-31")
     * @return Jogos recentes
     */
    @GET("games")
    Call<GameResponse> getRecentGames(
            @Query("key") String apiKey,
            @Query("ordering") String ordering, // "-released"
            @Query("page_size") int pageSize,
            @Query("dates") String dates
    );

    /**
     * Obtém jogos de um género específico
     * @param apiKey Chave da API
     * @param genreId ID do género
     * @param pageSize Número de jogos
     * @return Jogos do género
     */
    @GET("games")
    Call<GameResponse> getGamesByGenre(
            @Query("key") String apiKey,
            @Query("genres") String genreId,
            @Query("page_size") int pageSize,
            @Query("ordering") String ordering
    );

    /**
     * Obtém jogos de uma plataforma específica
     * @param apiKey Chave da API
     * @param platformId ID da plataforma
     * @param pageSize Número de jogos
     * @return Jogos da plataforma
     */
    @GET("games")
    Call<GameResponse> getGamesByPlatform(
            @Query("key") String apiKey,
            @Query("platforms") String platformId,
            @Query("page_size") int pageSize,
            @Query("ordering") String ordering
    );

    /**
     * Obtém screenshots de um jogo
     * @param gameId ID do jogo
     * @param apiKey Chave da API
     * @return Screenshots do jogo
     */
    @GET("games/{id}/screenshots")
    Call<Object> getGameScreenshots(
            @Path("id") int gameId,
            @Query("key") String apiKey
    );

    /**
     * Obtém jogos similares
     * @param gameId ID do jogo base
     * @param apiKey Chave da API
     * @return Jogos similares
     */
    @GET("games/{id}/suggested")
    Call<GameResponse> getSimilarGames(
            @Path("id") int gameId,
            @Query("key") String apiKey
    );

    /**
     * Obtém estatísticas de um jogo
     * @param gameId ID do jogo
     * @param apiKey Chave da API
     * @return Estatísticas do jogo
     */
    @GET("games/{id}")
    Call<Object> getGameStats(
            @Path("id") int gameId,
            @Query("key") String apiKey
    );
}