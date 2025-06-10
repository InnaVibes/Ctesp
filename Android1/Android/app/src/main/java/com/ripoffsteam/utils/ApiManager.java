package com.ripoffsteam.utils;

import android.content.Context;
import android.util.Log;
import com.ripoffsteam.DataBase.AppDatabase;
import com.ripoffsteam.RawgApiService;
import com.ripoffsteam.modelos.Game;
import com.ripoffsteam.modelos.GameResponse;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;
import okhttp3.OkHttpClient;
import okhttp3.logging.HttpLoggingInterceptor;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Executors;

/**
 * Gestor para interações com a API RAWG - Salva automaticamente no DAO
 */
public class ApiManager {
    private static final String TAG = "ApiManager";
    private static final String BASE_URL = "https://api.rawg.io/api/";

    // ⚠️ IMPORTANTE: Substitua pela sua chave API válida do RAWG
    private static final String API_KEY = "c706cd3b99ae40e2b3fe089d19582ed6";

    private RawgApiService apiService;
    private Context context;
    private CacheManager cacheManager;
    private AppDatabase database;

    public ApiManager(Context context) {
        this.context = context;
        this.cacheManager = new CacheManager(context);
        this.database = AppDatabase.getInstance(context);

        // Configura logging
        HttpLoggingInterceptor logging = new HttpLoggingInterceptor();
        logging.setLevel(HttpLoggingInterceptor.Level.BASIC);

        OkHttpClient client = new OkHttpClient.Builder()
                .addInterceptor(logging)
                .build();

        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl(BASE_URL)
                .client(client)
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        apiService = retrofit.create(RawgApiService.class);

        Log.d(TAG, "🚀 ApiManager inicializado com salvamento automático no DAO");
    }

    /**
     * Interface para callbacks de carregamento de jogos
     */
    public interface GameLoadCallback {
        void onSuccess(List<Game> games);
        void onError(String error);
    }

    /**
     * Carrega jogos da API e salva automaticamente no DAO
     */
    public void loadGames(int page, int pageSize, String genre, String platform, GameLoadCallback callback) {
        Log.d(TAG, String.format("🌐 Carregando da API - Página: %d, Tamanho: %d, Género: %s, Plataforma: %s",
                page, pageSize, genre, platform));

        loadGamesFromApi(page, pageSize, genre, platform, callback, true);
    }

    /**
     * Carrega jogos da API com opção de salvar no DAO
     */
    private void loadGamesFromApi(int page, int pageSize, String genre, String platform,
                                  GameLoadCallback callback, boolean saveToDao) {
        Log.d(TAG, "🌐 Fazendo chamada à API RAWG...");

        Call<GameResponse> call = apiService.getGames(API_KEY, page, pageSize, genre, platform);

        call.enqueue(new Callback<GameResponse>() {
            @Override
            public void onResponse(Call<GameResponse> call, Response<GameResponse> response) {
                Log.d(TAG, "📡 Resposta da API recebida. Código: " + response.code());

                if (response.isSuccessful() && response.body() != null) {
                    List<Game> games = response.body().getResults();
                    Log.d(TAG, "✅ Recebidos " + games.size() + " jogos da API RAWG");

                    // Salva no DAO se solicitado
                    if (saveToDao) {
                        saveGamesToDao(games, page == 1); // Substitui cache apenas na página 1
                    }

                    callback.onSuccess(games);
                } else {
                    String errorMsg = "Erro na resposta da API: " + response.code();
                    Log.e(TAG, "❌ " + errorMsg);

                    // Em caso de erro, tenta carregar do DAO como fallback
                    if (page == 1) {
                        loadGamesFromDao(callback);
                    } else {
                        callback.onError(errorMsg);
                    }
                }
            }

            @Override
            public void onFailure(Call<GameResponse> call, Throwable t) {
                String errorMsg = "Falha na chamada da API: " + t.getMessage();
                Log.e(TAG, "❌ " + errorMsg);
                t.printStackTrace();

                // Em caso de falha, tenta carregar do DAO como fallback
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
     * Salva jogos no DAO (base de dados local)
     */
    private void saveGamesToDao(List<Game> games, boolean replaceCache) {
        Executors.newSingleThreadExecutor().execute(() -> {
            try {
                Log.d(TAG, "💾 Salvando " + games.size() + " jogos no DAO...");

                if (replaceCache) {
                    // Se é a primeira página, substitui todo o cache
                    Log.d(TAG, "🔄 Substituindo cache completo...");
                    // Primeiro, limpa jogos antigos (opcional)
                    // database.gameDao().deleteAll(); // Descomenta se quiseres limpar primeiro
                }

                // Insere/atualiza jogos (REPLACE strategy no DAO vai substituir duplicados)
                database.gameDao().insertAll(games);

                // Marca cache como atualizado
                cacheManager.markGamesCacheUpdated();

                Log.d(TAG, "✅ " + games.size() + " jogos salvos no DAO com sucesso");

                // Verifica quantos jogos há agora no total
                verifyDaoContent();

            } catch (Exception e) {
                Log.e(TAG, "❌ Erro ao salvar jogos no DAO: " + e.getMessage(), e);
            }
        });
    }

    /**
     * Carrega jogos do DAO (fallback)
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
                            callback.onError("Erro de rede e sem dados em cache");
                        }
                    });
                }
            } catch (Exception e) {
                Log.e(TAG, "❌ Erro ao carregar jogos do DAO: " + e.getMessage(), e);
                if (context instanceof android.app.Activity) {
                    ((android.app.Activity) context).runOnUiThread(() ->
                            callback.onError("Erro ao carregar jogos do cache"));
                }
            }
        });
    }

    /**
     * Verifica conteúdo atual do DAO
     */
    private void verifyDaoContent() {
        try {
            List<Game> allGames = database.gameDao().getAll();
            Log.d(TAG, String.format("📊 DAO contém %d jogos no total", allGames.size()));

            // Log de alguns jogos para verificar
            for (int i = 0; i < Math.min(3, allGames.size()); i++) {
                Game game = allGames.get(i);
                Log.d(TAG, String.format("📋 Jogo %d no DAO: %s (ID: %s)", i+1, game.getName(), game.getId()));
            }
        } catch (Exception e) {
            Log.e(TAG, "❌ Erro ao verificar conteúdo do DAO: " + e.getMessage());
        }
    }

    /**
     * Pesquisa jogos por nome - salva resultados no DAO
     */
    public void searchGames(String query, GameLoadCallback callback) {
        Log.d(TAG, "🔍 Pesquisando jogos na API: " + query);

        Call<GameResponse> call = apiService.searchGames(API_KEY, query, 20);

        call.enqueue(new Callback<GameResponse>() {
            @Override
            public void onResponse(Call<GameResponse> call, Response<GameResponse> response) {
                if (response.isSuccessful() && response.body() != null) {
                    List<Game> games = response.body().getResults();
                    Log.d(TAG, "✅ Pesquisa API encontrou " + games.size() + " jogos");

                    // Salva resultados da pesquisa no DAO (sem substituir cache)
                    if (!games.isEmpty()) {
                        saveGamesToDao(games, false);
                    }

                    callback.onSuccess(games);
                } else {
                    Log.e(TAG, "❌ Erro na pesquisa API: " + response.code());
                    // Fallback para pesquisa local no DAO
                    searchGamesInDao(query, callback);
                }
            }

            @Override
            public void onFailure(Call<GameResponse> call, Throwable t) {
                Log.e(TAG, "❌ Falha na pesquisa API: " + t.getMessage());
                // Fallback para pesquisa local no DAO
                searchGamesInDao(query, callback);
            }
        });
    }

    /**
     * Pesquisa jogos no DAO (fallback)
     */
    private void searchGamesInDao(String query, GameLoadCallback callback) {
        Executors.newSingleThreadExecutor().execute(() -> {
            try {
                List<Game> games = database.gameDao().findGameWithName("%" + query + "%");
                Log.d(TAG, "📦 Pesquisa no DAO encontrou " + games.size() + " jogos");

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

    /**
     * Força refresh completo - API para DAO
     */
    public void forceRefresh(GameLoadCallback callback) {
        Log.d(TAG, "🔄 Forçando refresh completo da API para o DAO...");

        // Limpa cache
        cacheManager.clearAllCaches();

        // Carrega da API e salva no DAO
        loadGamesFromApi(1, 30, null, null, new GameLoadCallback() {
            @Override
            public void onSuccess(List<Game> games) {
                Log.d(TAG, "✅ Refresh completo: " + games.size() + " jogos atualizados no DAO");
                callback.onSuccess(games);
            }

            @Override
            public void onError(String error) {
                Log.e(TAG, "❌ Erro no refresh: " + error);
                callback.onError(error);
            }
        }, true);
    }

    /**
     * Carrega múltiplas páginas da API e salva todas no DAO
     */
    public void loadMultiplePagesAndSave(int maxPages, GameLoadCallback callback) {
        Log.d(TAG, "📚 Carregando " + maxPages + " páginas da API para o DAO...");

        final List<Game> allGames = new ArrayList<>();
        final int[] pagesLoaded = {0};
        final int[] errors = {0};

        for (int page = 1; page <= maxPages; page++) {
            loadGamesFromApi(page, 20, null, null, new GameLoadCallback() {
                @Override
                public void onSuccess(List<Game> games) {
                    synchronized (allGames) {
                        allGames.addAll(games);
                        pagesLoaded[0]++;

                        Log.d(TAG, String.format("📄 Página %d carregada: %d jogos", pagesLoaded[0], games.size()));

                        // Se todas as páginas foram carregadas
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
                        Log.e(TAG, "❌ Erro na página " + (pagesLoaded[0] + errors[0]) + ": " + error);

                        // Se todas as páginas foram processadas (com ou sem erro)
                        if (pagesLoaded[0] + errors[0] >= maxPages) {
                            if (!allGames.isEmpty()) {
                                Log.d(TAG, "✅ Processamento completo com alguns erros. Total: " + allGames.size() + " jogos");
                                callback.onSuccess(allGames);
                            } else {
                                callback.onError("Erro ao carregar todas as páginas");
                            }
                        }
                    }
                }
            }, true); // Salva todas as páginas no DAO
        }
    }

    /**
     * Obtém estatísticas do DAO
     */
    public void getDaoStats(StatisticsCallback callback) {
        Executors.newSingleThreadExecutor().execute(() -> {
            try {
                int totalGames = database.gameDao().getAll().size();

                // Conta por género (se quiseres)
                // List<Game> actionGames = database.gameDao().getGamesByGenre("action");

                if (context instanceof android.app.Activity) {
                    ((android.app.Activity) context).runOnUiThread(() ->
                            callback.onStatsLoaded(totalGames));
                }
            } catch (Exception e) {
                Log.e(TAG, "❌ Erro ao obter stats do DAO: " + e.getMessage());
            }
        });
    }

    public interface StatisticsCallback {
        void onStatsLoaded(int totalGames);
    }
}