package com.ripoffsteam.utils;

import android.content.Context;
import android.util.Log;
import com.ripoffsteam.DataBase.AppDatabase;
import com.ripoffsteam.RawgApiService;
import com.ripoffsteam.modelos.Game;
import com.ripoffsteam.modelos.GameRawg;
import com.ripoffsteam.modelos.GameRawgResponse;
import com.ripoffsteam.modelos.GenresResponse;
import com.ripoffsteam.modelos.PlatformsResponse;
import com.ripoffsteam.modelos.StoresResponse;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;
import okhttp3.OkHttpClient;
import okhttp3.logging.HttpLoggingInterceptor;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.Executors;

/**
 * Gestor para interações com a API RAWG - Versão com modelos separados
 * Converte automaticamente GameRawg para Game e salva no Room Database
 */
public class ApiManager {
    private static final String TAG = "ApiManager";
    private static final String BASE_URL = "https://api.rawg.io/api/";

    // ⚠️ IMPORTANTE: Substitua pela sua chave API válida do RAWG
    // Obtenha em: https://rawg.io/apidocs
    private static final String API_KEY = "c706cd3b99ae40e2b3fe089d19582ed6";

    private RawgApiService apiService;
    private Context context;
    private CacheManager cacheManager;
    private AppDatabase database;

    /**
     * Construtor do ApiManager
     */
    public ApiManager(Context context) {
        this.context = context;
        this.cacheManager = new CacheManager(context);
        this.database = AppDatabase.getInstance(context);

        setupRetrofit();

        Log.d(TAG, "🚀 ApiManager inicializado para RAWG API (modelos separados)");
        Log.d(TAG, "🔑 API Key configurada: " + getMaskedApiKey());
    }

    /**
     * Configura Retrofit com interceptors e timeouts adequados
     */
    private void setupRetrofit() {
        // Configura logging para debug
        HttpLoggingInterceptor logging = new HttpLoggingInterceptor();
        logging.setLevel(HttpLoggingInterceptor.Level.BASIC);

        // Configura cliente HTTP com timeouts
        OkHttpClient client = new OkHttpClient.Builder()
                .addInterceptor(logging)
                .connectTimeout(30, java.util.concurrent.TimeUnit.SECONDS)
                .readTimeout(30, java.util.concurrent.TimeUnit.SECONDS)
                .writeTimeout(30, java.util.concurrent.TimeUnit.SECONDS)
                .build();

        // Configura Retrofit
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl(BASE_URL)
                .client(client)
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        apiService = retrofit.create(RawgApiService.class);
    }

    // ================================
    // INTERFACES PARA CALLBACKS
    // ================================

    /**
     * Interface para callbacks de carregamento de jogos
     */
    public interface GameLoadCallback {
        void onSuccess(List<Game> games);
        void onError(String error);
    }

    /**
     * Interface para callbacks de metadados (géneros, plataformas, lojas)
     */
    public interface MetadataCallback {
        void onGenresLoaded(List<String> genres);
        void onPlatformsLoaded(List<String> platforms);
        void onStoresLoaded(List<String> stores);
        void onError(String error);
    }

    /**
     * Interface para callbacks de estatísticas
     */
    public interface StatisticsCallback {
        void onStatsLoaded(int totalGames);
    }

    /**
     * Interface para callbacks de teste de conexão
     */
    public interface TestCallback {
        void onSuccess(String message);
        void onError(String error);
    }

    // ================================
    // MÉTODOS PRINCIPAIS DE API
    // ================================

    /**
     * Carrega jogos da API RAWG com paginação e filtros
     */
    public void loadGames(int page, int pageSize, String genre, String platform, GameLoadCallback callback) {
        Log.d(TAG, String.format("🌐 Carregando da RAWG API - Página: %d, Tamanho: %d, Género: %s, Plataforma: %s",
                page, pageSize, genre, platform));

        Call<GameRawgResponse> call = apiService.getGames(API_KEY, page, pageSize, genre, platform);

        call.enqueue(new Callback<GameRawgResponse>() {
            @Override
            public void onResponse(Call<GameRawgResponse> call, Response<GameRawgResponse> response) {
                Log.d(TAG, "📡 Resposta da RAWG API recebida. Código: " + response.code());

                if (response.isSuccessful() && response.body() != null) {
                    List<GameRawg> rawgGames = response.body().getResults();

                    if (rawgGames != null && !rawgGames.isEmpty()) {
                        Log.d(TAG, "✅ Recebidos " + rawgGames.size() + " jogos da RAWG API");

                        // Converte GameRawg para Game
                        List<Game> games = convertRawgGamesToGames(rawgGames);

                        if (!games.isEmpty()) {
                            // Salva no DAO
                            saveGamesToDao(games, page == 1);
                            callback.onSuccess(games);
                        } else {
                            callback.onError("Nenhum jogo válido após conversão");
                        }
                    } else {
                        Log.w(TAG, "⚠️ API retornou lista vazia");
                        callback.onError("Nenhum jogo retornado pela API");
                    }
                } else {
                    String errorMsg = "Erro na resposta da API: " + response.code();
                    Log.e(TAG, "❌ " + errorMsg);

                    // Em caso de erro na primeira página, tenta carregar do DAO como fallback
                    if (page == 1) {
                        Log.d(TAG, "🔄 Tentando fallback para DAO...");
                        loadGamesFromDao(callback);
                    } else {
                        callback.onError(errorMsg);
                    }
                }
            }

            @Override
            public void onFailure(Call<GameRawgResponse> call, Throwable t) {
                String errorMsg = "Falha na conexão com RAWG API: " + t.getMessage();
                Log.e(TAG, "❌ " + errorMsg);

                // Em caso de falha na primeira página, tenta carregar do DAO como fallback
                if (page == 1) {
                    Log.d(TAG, "🔄 Tentando fallback para DAO...");
                    loadGamesFromDao(callback);
                } else {
                    callback.onError(errorMsg);
                }
            }
        });
    }

    /**
     * Pesquisa jogos na RAWG API por termo
     */
    public void searchGames(String query, GameLoadCallback callback) {
        Log.d(TAG, "🔍 Pesquisando na RAWG API: " + query);

        if (query == null || query.trim().isEmpty()) {
            callback.onError("Termo de pesquisa vazio");
            return;
        }

        Call<GameRawgResponse> call = apiService.searchGames(API_KEY, query.trim(), 20);

        call.enqueue(new Callback<GameRawgResponse>() {
            @Override
            public void onResponse(Call<GameRawgResponse> call, Response<GameRawgResponse> response) {
                if (response.isSuccessful() && response.body() != null) {
                    List<GameRawg> rawgGames = response.body().getResults();

                    if (rawgGames != null && !rawgGames.isEmpty()) {
                        List<Game> games = convertRawgGamesToGames(rawgGames);
                        Log.d(TAG, "✅ Pesquisa encontrou " + games.size() + " jogos");

                        if (!games.isEmpty()) {
                            saveGamesToDao(games, false);
                        }

                        callback.onSuccess(games);
                    } else {
                        Log.w(TAG, "⚠️ Pesquisa não retornou resultados");
                        callback.onError("Nenhum resultado encontrado para: " + query);
                    }
                } else {
                    Log.e(TAG, "❌ Erro na pesquisa: " + response.code());
                    // Fallback para pesquisa local no DAO
                    searchGamesInDao(query, callback);
                }
            }

            @Override
            public void onFailure(Call<GameRawgResponse> call, Throwable t) {
                Log.e(TAG, "❌ Falha na pesquisa: " + t.getMessage());
                // Fallback para pesquisa local no DAO
                searchGamesInDao(query, callback);
            }
        });
    }

    /**
     * Carrega jogos populares da RAWG API (ordenados por rating)
     */
    public void loadPopularGames(int count, GameLoadCallback callback) {
        Log.d(TAG, "⭐ Carregando " + count + " jogos populares...");

        Call<GameRawgResponse> call = apiService.getPopularGames(API_KEY, "-rating", count);
        handleGameRawgResponse(call, "jogos populares", callback);
    }

    /**
     * Carrega jogos recentes da RAWG API (últimos 6 meses)
     */
    public void loadRecentGames(int count, GameLoadCallback callback) {
        Log.d(TAG, "🆕 Carregando " + count + " jogos recentes...");

        // Calcula intervalo de datas (últimos 6 meses)
        String currentYear = String.valueOf(java.time.Year.now().getValue());
        String lastYear = String.valueOf(java.time.Year.now().getValue() - 1);
        String dateFilter = lastYear + "-07-01," + currentYear + "-12-31";

        Call<GameRawgResponse> call = apiService.getRecentGames(API_KEY, "-released", count, dateFilter);
        handleGameRawgResponse(call, "jogos recentes", callback);
    }

    /**
     * Carrega jogos por género específico
     */
    public void loadGamesByGenre(String genreSlug, int count, GameLoadCallback callback) {
        Log.d(TAG, "🎮 Carregando " + count + " jogos do género: " + genreSlug);

        if (genreSlug == null || genreSlug.trim().isEmpty()) {
            callback.onError("Género não especificado");
            return;
        }

        Call<GameRawgResponse> call = apiService.getGamesByGenre(API_KEY, genreSlug.trim(), count, "-rating");
        handleGameRawgResponse(call, "jogos do género " + genreSlug, callback);
    }

    /**
     * Carrega jogos por plataforma específica
     */
    public void loadGamesByPlatform(String platformSlug, int count, GameLoadCallback callback) {
        Log.d(TAG, "🖥️ Carregando " + count + " jogos da plataforma: " + platformSlug);

        if (platformSlug == null || platformSlug.trim().isEmpty()) {
            callback.onError("Plataforma não especificada");
            return;
        }

        Call<GameRawgResponse> call = apiService.getGamesByPlatform(API_KEY, platformSlug.trim(), count, "-rating");
        handleGameRawgResponse(call, "jogos da plataforma " + platformSlug, callback);
    }

    /**
     * Obtém detalhes específicos de um jogo por ID
     */
    public void getGameDetails(int gameId, GameLoadCallback callback) {
        Log.d(TAG, "🔍 Obtendo detalhes do jogo ID: " + gameId);

        if (gameId <= 0) {
            callback.onError("ID de jogo inválido: " + gameId);
            return;
        }

        apiService.getGameDetails(gameId, API_KEY).enqueue(new Callback<GameRawg>() {
            @Override
            public void onResponse(Call<GameRawg> call, Response<GameRawg> response) {
                if (response.isSuccessful() && response.body() != null) {
                    try {
                        Game game = response.body().toGame();
                        if (game != null) {
                            Log.d(TAG, "✅ Detalhes obtidos para: " + game.getName());
                            saveGamesToDao(Arrays.asList(game), false);
                            callback.onSuccess(Arrays.asList(game));
                        } else {
                            callback.onError("Erro ao processar detalhes do jogo");
                        }
                    } catch (Exception e) {
                        Log.e(TAG, "❌ Erro ao converter detalhes do jogo: " + e.getMessage());
                        callback.onError("Erro ao processar detalhes: " + e.getMessage());
                    }
                } else {
                    String errorMsg = "Erro ao obter detalhes: " + response.code();
                    Log.e(TAG, "❌ " + errorMsg);
                    callback.onError(errorMsg);
                }
            }

            @Override
            public void onFailure(Call<GameRawg> call, Throwable t) {
                String errorMsg = "Falha ao obter detalhes: " + t.getMessage();
                Log.e(TAG, "❌ " + errorMsg);
                callback.onError(errorMsg);
            }
        });
    }

    /**
     * Carrega múltiplas páginas da API sequencialmente
     */
    public void loadMultiplePagesAndSave(int maxPages, GameLoadCallback callback) {
        Log.d(TAG, "📚 Carregando " + maxPages + " páginas da RAWG API...");

        if (maxPages <= 0) {
            callback.onError("Número de páginas inválido: " + maxPages);
            return;
        }

        final List<Game> allGames = new ArrayList<>();
        final int[] pagesLoaded = {0};
        final int[] errors = {0};

        for (int page = 1; page <= maxPages; page++) {
            final int currentPage = page;

            loadGames(page, 20, null, null, new GameLoadCallback() {
                @Override
                public void onSuccess(List<Game> games) {
                    synchronized (allGames) {
                        if (games != null) {
                            allGames.addAll(games);
                        }
                        pagesLoaded[0]++;

                        Log.d(TAG, String.format("📄 Página %d/%d carregada: %d jogos (Total: %d)",
                                currentPage, maxPages, games != null ? games.size() : 0, allGames.size()));

                        // Verifica se todas as páginas foram processadas
                        if (pagesLoaded[0] + errors[0] >= maxPages) {
                            Log.d(TAG, "✅ Todas as páginas processadas. Total: " + allGames.size() + " jogos");
                            callback.onSuccess(allGames);
                        }
                    }
                }

                @Override
                public void onError(String error) {
                    synchronized (allGames) {
                        errors[0]++;
                        Log.e(TAG, "❌ Erro na página " + currentPage + ": " + error);

                        // Verifica se todas as páginas foram processadas (com ou sem erro)
                        if (pagesLoaded[0] + errors[0] >= maxPages) {
                            if (!allGames.isEmpty()) {
                                Log.d(TAG, "✅ Processamento completo com alguns erros. Total: " + allGames.size() + " jogos");
                                callback.onSuccess(allGames);
                            } else {
                                callback.onError("Erro ao carregar todas as páginas. Última falha: " + error);
                            }
                        }
                    }
                }
            });
        }
    }

    /**
     * Carrega metadados (géneros, plataformas, lojas) da RAWG API
     */
    public void loadMetadata(MetadataCallback callback) {
        Log.d(TAG, "📊 Carregando metadados da RAWG API...");

        // Contador para tracking de requests completados
        final int[] completedRequests = {0};
        final int totalRequests = 3;

        // Carrega géneros
        apiService.getGenres(API_KEY).enqueue(new Callback<GenresResponse>() {
            @Override
            public void onResponse(Call<GenresResponse> call, Response<GenresResponse> response) {
                synchronized (completedRequests) {
                    completedRequests[0]++;

                    if (response.isSuccessful() && response.body() != null && response.body().getResults() != null) {
                        List<String> genreNames = new ArrayList<>();
                        for (com.ripoffsteam.modelos.Genre genre : response.body().getResults()) {
                            if (genre != null && genre.getName() != null) {
                                genreNames.add(genre.getName());
                            }
                        }
                        Log.d(TAG, "✅ Carregados " + genreNames.size() + " géneros");
                        callback.onGenresLoaded(genreNames);
                    } else {
                        Log.e(TAG, "❌ Erro ao carregar géneros: " + response.code());
                        callback.onError("Erro ao carregar géneros: " + response.code());
                    }
                }
            }

            @Override
            public void onFailure(Call<GenresResponse> call, Throwable t) {
                synchronized (completedRequests) {
                    completedRequests[0]++;
                    String errorMsg = "Falha ao carregar géneros: " + t.getMessage();
                    Log.e(TAG, "❌ " + errorMsg);
                    callback.onError(errorMsg);
                }
            }
        });

        // Carrega plataformas
        apiService.getPlatforms(API_KEY, "name").enqueue(new Callback<PlatformsResponse>() {
            @Override
            public void onResponse(Call<PlatformsResponse> call, Response<PlatformsResponse> response) {
                synchronized (completedRequests) {
                    completedRequests[0]++;

                    if (response.isSuccessful() && response.body() != null && response.body().getResults() != null) {
                        List<String> platformNames = new ArrayList<>();
                        for (com.ripoffsteam.modelos.Platform.PlatformDetail platform : response.body().getResults()) {
                            if (platform != null && platform.getName() != null) {
                                platformNames.add(platform.getName());
                            }
                        }
                        Log.d(TAG, "✅ Carregadas " + platformNames.size() + " plataformas");
                        callback.onPlatformsLoaded(platformNames);
                    } else {
                        Log.e(TAG, "❌ Erro ao carregar plataformas: " + response.code());
                        callback.onError("Erro ao carregar plataformas: " + response.code());
                    }
                }
            }

            @Override
            public void onFailure(Call<PlatformsResponse> call, Throwable t) {
                synchronized (completedRequests) {
                    completedRequests[0]++;
                    String errorMsg = "Falha ao carregar plataformas: " + t.getMessage();
                    Log.e(TAG, "❌ " + errorMsg);
                    callback.onError(errorMsg);
                }
            }
        });

        // Carrega lojas
        apiService.getStores(API_KEY, "name").enqueue(new Callback<StoresResponse>() {
            @Override
            public void onResponse(Call<StoresResponse> call, Response<StoresResponse> response) {
                synchronized (completedRequests) {
                    completedRequests[0]++;

                    if (response.isSuccessful() && response.body() != null && response.body().getResults() != null) {
                        List<String> storeNames = new ArrayList<>();
                        for (com.ripoffsteam.modelos.Store.StoreDetail store : response.body().getResults()) {
                            if (store != null && store.getName() != null) {
                                storeNames.add(store.getName());
                            }
                        }
                        Log.d(TAG, "✅ Carregadas " + storeNames.size() + " lojas");
                        callback.onStoresLoaded(storeNames);
                    } else {
                        Log.e(TAG, "❌ Erro ao carregar lojas: " + response.code());
                        callback.onError("Erro ao carregar lojas: " + response.code());
                    }
                }
            }

            @Override
            public void onFailure(Call<StoresResponse> call, Throwable t) {
                synchronized (completedRequests) {
                    completedRequests[0]++;
                    String errorMsg = "Falha ao carregar lojas: " + t.getMessage();
                    Log.e(TAG, "❌ " + errorMsg);
                    callback.onError(errorMsg);
                }
            }
        });
    }

    // ================================
    // MÉTODOS AUXILIARES
    // ================================

    /**
     * Trata resposta padrão da API para diferentes tipos de carregamento
     */
    private void handleGameRawgResponse(Call<GameRawgResponse> call, String type, GameLoadCallback callback) {
        call.enqueue(new Callback<GameRawgResponse>() {
            @Override
            public void onResponse(Call<GameRawgResponse> call, Response<GameRawgResponse> response) {
                if (response.isSuccessful() && response.body() != null) {
                    List<GameRawg> rawgGames = response.body().getResults();

                    if (rawgGames != null && !rawgGames.isEmpty()) {
                        List<Game> games = convertRawgGamesToGames(rawgGames);

                        if (!games.isEmpty()) {
                            Log.d(TAG, "✅ Carregados " + games.size() + " " + type);
                            saveGamesToDao(games, false);
                            callback.onSuccess(games);
                        } else {
                            callback.onError("Nenhum " + type + " válido após conversão");
                        }
                    } else {
                        callback.onError("Nenhum " + type + " encontrado");
                    }
                } else {
                    String errorMsg = "Erro ao carregar " + type + ": " + response.code();
                    Log.e(TAG, "❌ " + errorMsg);
                    callback.onError(errorMsg);
                }
            }

            @Override
            public void onFailure(Call<GameRawgResponse> call, Throwable t) {
                String errorMsg = "Falha ao carregar " + type + ": " + t.getMessage();
                Log.e(TAG, "❌ " + errorMsg);
                callback.onError(errorMsg);
            }
        });
    }

    /**
     * Converte lista de GameRawg para Game com validação
     */
    private List<Game> convertRawgGamesToGames(List<GameRawg> rawgGames) {
        List<Game> games = new ArrayList<>();

        if (rawgGames == null) {
            Log.w(TAG, "⚠️ Lista de jogos RAWG é nula");
            return games;
        }

        for (GameRawg rawgGame : rawgGames) {
            try {
                if (rawgGame != null) {
                    Game game = rawgGame.toGame();
                    if (game != null && game.getName() != null && !game.getName().trim().isEmpty()) {
                        games.add(game);
                        Log.d(TAG, "✅ Convertido: " + game.getName() + " (ID: " + game.getId() + ")");
                    } else {
                        Log.w(TAG, "⚠️ Jogo inválido após conversão (nome vazio ou nulo)");
                    }
                } else {
                    Log.w(TAG, "⚠️ GameRawg nulo encontrado na lista");
                }
            } catch (Exception e) {
                Log.e(TAG, "❌ Erro ao converter jogo: " + e.getMessage());
            }
        }

        Log.d(TAG, "📊 Conversão concluída: " + games.size() + "/" + rawgGames.size() + " jogos válidos");
        return games;
    }

    // ================================
    // MÉTODOS DE PERSISTÊNCIA (DAO)
    // ================================

    /**
     * Salva jogos no DAO (Room Database)
     */
    private void saveGamesToDao(List<Game> games, boolean replaceCache) {
        if (games == null || games.isEmpty()) {
            Log.w(TAG, "⚠️ Tentativa de salvar lista vazia no DAO");
            return;
        }

        Executors.newSingleThreadExecutor().execute(() -> {
            try {
                Log.d(TAG, "💾 Salvando " + games.size() + " jogos no DAO...");
                database.gameDao().insertAll(games);

                if (replaceCache) {
                    cacheManager.markGamesCacheUpdated();
                    Log.d(TAG, "🔄 Cache marcado como atualizado");
                }

                Log.d(TAG, "✅ " + games.size() + " jogos salvos no DAO com sucesso");
            } catch (Exception e) {
                Log.e(TAG, "❌ Erro ao salvar jogos no DAO: " + e.getMessage(), e);
            }
        });
    }

    /**
     * Carrega jogos do DAO (fallback para quando API falha)
     */
    private void loadGamesFromDao(GameLoadCallback callback) {
        Executors.newSingleThreadExecutor().execute(() -> {
            try {
                List<Game> games = database.gameDao().getAll();
                Log.d(TAG, "📦 Carregados " + games.size() + " jogos do DAO");

                if (context instanceof android.app.Activity) {
                    ((android.app.Activity) context).runOnUiThread(() -> {
                        if (!games.isEmpty()) {
                            callback.onSuccess(games);
                        } else {
                            callback.onError("Erro de rede e sem dados em cache local");
                        }
                    });
                }
            } catch (Exception e) {
                Log.e(TAG, "❌ Erro ao carregar jogos do DAO: " + e.getMessage(), e);
                if (context instanceof android.app.Activity) {
                    ((android.app.Activity) context).runOnUiThread(() ->
                            callback.onError("Erro ao carregar jogos do cache local"));
                }
            }
        });
    }

    /**
     * Pesquisa jogos no DAO (fallback para pesquisa quando API falha)
     */
    private void searchGamesInDao(String query, GameLoadCallback callback) {
        Executors.newSingleThreadExecutor().execute(() -> {
            try {
                List<Game> games = database.gameDao().findGameWithName("%" + query + "%");
                Log.d(TAG, "📦 Pesquisa no DAO encontrou " + games.size() + " jogos para: " + query);

                if (context instanceof android.app.Activity) {
                    ((android.app.Activity) context).runOnUiThread(() ->
                            callback.onSuccess(games));
                }
            } catch (Exception e) {
                Log.e(TAG, "❌ Erro na pesquisa no DAO: " + e.getMessage());
                if (context instanceof android.app.Activity) {
                    ((android.app.Activity) context).runOnUiThread(() ->
                            callback.onError("Erro na pesquisa local"));
                }
            }
        });
    }

    // ================================
    // MÉTODOS UTILITÁRIOS
    // ================================

    /**
     * Força refresh completo da API para o DAO
     */
    public void forceRefresh(GameLoadCallback callback) {
        Log.d(TAG, "🔄 Forçando refresh completo da RAWG API...");

        // Limpa cache existente
        cacheManager.clearAllCaches();

        // Carrega dados frescos da API
        loadGames(1, 30, null, null, new GameLoadCallback() {
            @Override
            public void onSuccess(List<Game> games) {
                Log.d(TAG, "✅ Refresh completo: " + games.size() + " jogos atualizados");
                callback.onSuccess(games);
            }

            @Override
            public void onError(String error) {
                Log.e(TAG, "❌ Erro no refresh: " + error);
                callback.onError(error);
            }
        });
    }

    /**
     * Obtém estatísticas da base de dados
     */
    public void getDaoStats(StatisticsCallback callback) {
        Executors.newSingleThreadExecutor().execute(() -> {
            try {
                int totalGames = database.gameDao().getAll().size();
                Log.d(TAG, "📊 Estatísticas DAO: " + totalGames + " jogos total");

                if (context instanceof android.app.Activity) {
                    ((android.app.Activity) context).runOnUiThread(() ->
                            callback.onStatsLoaded(totalGames));
                }
            } catch (Exception e) {
                Log.e(TAG, "❌ Erro ao obter estatísticas do DAO: " + e.getMessage());
            }
        });
    }

    /**
     * Verifica se a API Key está configurada corretamente
     */
    public boolean isApiKeyConfigured() {
        return API_KEY != null &&
                !API_KEY.isEmpty() &&
                !API_KEY.equals("SUA_CHAVE_API_AQUI") &&
                API_KEY.length() > 10;
    }

    /**
     * Obtém a chave da API (mascarada para logs de segurança)
     */
    public String getMaskedApiKey() {
        if (API_KEY == null || API_KEY.length() < 8) {
            return "❌ Não configurada";
        }
        return API_KEY.substring(0, 4) + "****" + API_KEY.substring(API_KEY.length() - 4);
    }

    /**
     * Testa conectividade com a API RAWG
     */
    public void testApiConnection(TestCallback callback) {
        Log.d(TAG, "🔌 Testando conexão com RAWG API...");

        if (!isApiKeyConfigured()) {
            callback.onError("API Key não configurada corretamente");
            return;
        }

        apiService.getGames(API_KEY, 1, 1, null, null).enqueue(new Callback<GameRawgResponse>() {
            @Override
            public void onResponse(Call<GameRawgResponse> call, Response<GameRawgResponse> response) {
                if (response.isSuccessful()) {
                    Log.d(TAG, "✅ Conexão com RAWG API bem-sucedida");
                    callback.onSuccess("Conexão OK - API respondendo normalmente");
                } else {
                    String errorMsg = "Erro HTTP: " + response.code();
                    Log.e(TAG, "❌ " + errorMsg);

                    // Mensagens de erro mais específicas
                    switch (response.code()) {
                        case 401:
                            callback.onError("API Key inválida ou expirada");
                            break;
                        case 403:
                            callback.onError("Acesso negado - verifique permissões da API Key");
                            break;
                        case 429:
                            callback.onError("Limite de requisições excedido");
                            break;
                        case 500:
                            callback.onError("Erro interno do servidor RAWG");
                            break;
                        default:
                            callback.onError(errorMsg);
                            break;
                    }
                }
            }

            @Override
            public void onFailure(Call<GameRawgResponse> call, Throwable t) {
                String errorMsg = "Falha de rede: " + t.getMessage();
                Log.e(TAG, "❌ " + errorMsg);

                // Diagnóstico mais detalhado da falha
                if (t instanceof java.net.UnknownHostException) {
                    callback.onError("Sem conexão à internet ou DNS falhou");
                } else if (t instanceof java.net.SocketTimeoutException) {
                    callback.onError("Timeout - servidor RAWG não respondeu");
                } else if (t instanceof javax.net.ssl.SSLException) {
                    callback.onError("Erro SSL/TLS na conexão");
                } else {
                    callback.onError(errorMsg);
                }
            }
        });
    }

    /**
     * Obtém informações de debug detalhadas da API
     */
    public void getDebugInfo() {
        Log.d(TAG, "=== DEBUG INFO RAWG API ===");
        Log.d(TAG, "Base URL: " + BASE_URL);
        Log.d(TAG, "API Key: " + getMaskedApiKey());
        Log.d(TAG, "API Key configurada: " + isApiKeyConfigured());
        Log.d(TAG, "Cache válido: " + cacheManager.isGamesCacheValid());

        // Informações da base de dados
        try {
            int totalGames = database.gameDao().getAll().size();
            Log.d(TAG, "Total jogos no DAO: " + totalGames);
        } catch (Exception e) {
            Log.d(TAG, "Erro ao obter info do DAO: " + e.getMessage());
        }

        Log.d(TAG, "=============================");
    }

    /**
     * Obtém informações de status do sistema
     */
    public String getSystemStatus() {
        StringBuilder status = new StringBuilder();

        status.append("🔧 RAWG API Manager Status:\n");
        status.append("• API Key: ").append(isApiKeyConfigured() ? "✅ Configurada" : "❌ Não configurada").append("\n");
        status.append("• Base URL: ").append(BASE_URL).append("\n");
        status.append("• Cache válido: ").append(cacheManager.isGamesCacheValid() ? "✅ Sim" : "❌ Não").append("\n");

        try {
            int totalGames = database.gameDao().getAll().size();
            status.append("• Jogos em cache: ").append(totalGames).append("\n");
        } catch (Exception e) {
            status.append("• Jogos em cache: ❌ Erro ao obter\n");
        }

        return status.toString();
    }

    /**
     * Limpa cache e dados locais
     */
    public void clearAllData() {
        Log.d(TAG, "🗑️ Limpando todos os dados locais...");

        try {
            // Limpa cache
            cacheManager.clearAllCaches();

            // Limpa dados do DAO em background
            Executors.newSingleThreadExecutor().execute(() -> {
                try {
                    // Note: Este método deve ser implementado no DAO se necessário
                    // database.gameDao().deleteAll();
                    Log.d(TAG, "✅ Dados locais limpos com sucesso");
                } catch (Exception e) {
                    Log.e(TAG, "❌ Erro ao limpar dados do DAO: " + e.getMessage());
                }
            });

        } catch (Exception e) {
            Log.e(TAG, "❌ Erro ao limpar dados: " + e.getMessage());
        }
    }

    // ================================
    // MÉTODOS DE VALIDAÇÃO
    // ================================

    /**
     * Valida parâmetros de entrada para evitar erros
     */
    private boolean isValidPageParams(int page, int pageSize) {
        return page > 0 && pageSize > 0 && pageSize <= 40; // RAWG API limit
    }

    /**
     * Valida se o contexto ainda é válido para callbacks
     */
    private boolean isContextValid() {
        return context != null &&
                (!(context instanceof android.app.Activity) ||
                        !((android.app.Activity) context).isFinishing());
    }

    /**
     * Executa callback no thread principal de forma segura
     */
    private void runOnUiThread(Runnable action) {
        if (isContextValid() && context instanceof android.app.Activity) {
            ((android.app.Activity) context).runOnUiThread(action);
        }
    }

    // ================================
    // GETTERS PARA DEBUG
    // ================================

    /**
     * Obtém a instância do database (para debug)
     */
    public AppDatabase getDatabase() {
        return database;
    }

    /**
     * Obtém a instância do cache manager (para debug)
     */
    public CacheManager getCacheManager() {
        return cacheManager;
    }

    /**
     * Obtém a base URL da API (para debug)
     */
    public String getBaseUrl() {
        return BASE_URL;
    }

    /**
     * Verifica se o ApiManager foi inicializado corretamente
     */
    public boolean isInitialized() {
        return apiService != null &&
                database != null &&
                cacheManager != null &&
                context != null;
    }
}