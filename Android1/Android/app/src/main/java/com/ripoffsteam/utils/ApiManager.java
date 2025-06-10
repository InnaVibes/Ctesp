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
import java.util.List;
import java.util.concurrent.Executors;

/**
 * Gestor para interações com a API RAWG
 */
public class ApiManager {
    private static final String TAG = "ApiManager";
    private static final String BASE_URL = "https://api.rawg.io/api/";
    private static final String API_KEY = "c706cd3b99ae40e2b3fe089d19582ed6"; // Substitua pela sua chave

    private RawgApiService apiService;
    private Context context;
    private CacheManager cacheManager;

    public ApiManager(Context context) {
        this.context = context;
        this.cacheManager = new CacheManager(context);

        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl(BASE_URL)
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        apiService = retrofit.create(RawgApiService.class);
    }

    /**
     * Interface para callbacks de carregamento de jogos
     */
    public interface GameLoadCallback {
        void onSuccess(List<Game> games);
        void onError(String error);
    }

    /**
     * Carrega jogos, usando cache se válido ou API se necessário
     */
    public void loadGames(int page, int pageSize, String genre, String platform, GameLoadCallback callback) {
        // Verifica se deve usar cache ou API
        if (page == 1 && cacheManager.isGamesCacheValid()) {
            loadGamesFromDatabase(callback);
        } else {
            loadGamesFromApi(page, pageSize, genre, platform, callback);
        }
    }

    /**
     * Carrega jogos da base de dados local (cache)
     */
    private void loadGamesFromDatabase(GameLoadCallback callback) {
        Executors.newSingleThreadExecutor().execute(() -> {
            try {
                AppDatabase db = AppDatabase.getInstance(context);
                List<Game> games = db.gameDao().getAll();

                // Executa callback na thread principal
                if (context instanceof android.app.Activity) {
                    ((android.app.Activity) context).runOnUiThread(() ->
                            callback.onSuccess(games));
                }
            } catch (Exception e) {
                Log.e(TAG, "Erro ao carregar jogos da BD: " + e.getMessage());
                if (context instanceof android.app.Activity) {
                    ((android.app.Activity) context).runOnUiThread(() ->
                            callback.onError("Erro ao carregar jogos do cache"));
                }
            }
        });
    }

    /**
     * Carrega jogos da API RAWG
     */
    private void loadGamesFromApi(int page, int pageSize, String genre, String platform, GameLoadCallback callback) {
        Call<GameResponse> call = apiService.getGames(API_KEY, page, pageSize, genre, platform);

        call.enqueue(new Callback<GameResponse>() {
            @Override
            public void onResponse(Call<GameResponse> call, Response<GameResponse> response) {
                if (response.isSuccessful() && response.body() != null) {
                    List<Game> games = response.body().getResults();

                    // Salva no cache se for a primeira página
                    if (page == 1) {
                        saveGamesToDatabase(games);
                    }

                    callback.onSuccess(games);
                } else {
                    Log.e(TAG, "Resposta da API não foi bem-sucedida: " + response.code());
                    callback.onError("Erro na resposta da API: " + response.code());
                }
            }

            @Override
            public void onFailure(Call<GameResponse> call, Throwable t) {
                Log.e(TAG, "Falha na chamada da API: " + t.getMessage());

                // Em caso de falha, tenta carregar do cache como fallback
                if (page == 1) {
                    loadGamesFromDatabase(new GameLoadCallback() {
                        @Override
                        public void onSuccess(List<Game> games) {
                            if (!games.isEmpty()) {
                                callback.onSuccess(games);
                            } else {
                                callback.onError("Erro de rede e sem dados em cache");
                            }
                        }

                        @Override
                        public void onError(String error) {
                            callback.onError("Erro de rede: " + t.getMessage());
                        }
                    });
                } else {
                    callback.onError("Erro de rede: " + t.getMessage());
                }
            }
        });
    }

    /**
     * Salva jogos na base de dados local
     */
    private void saveGamesToDatabase(List<Game> games) {
        Executors.newSingleThreadExecutor().execute(() -> {
            try {
                AppDatabase db = AppDatabase.getInstance(context);
                db.gameDao().insertAll(games);
                cacheManager.markGamesCacheUpdated();
                Log.d(TAG, "Jogos salvos na BD: " + games.size());
            } catch (Exception e) {
                Log.e(TAG, "Erro ao salvar jogos na BD: " + e.getMessage());
            }
        });
    }

    /**
     * Pesquisa jogos por nome
     */
    public void searchGames(String query, GameLoadCallback callback) {
        Call<GameResponse> call = apiService.searchGames(API_KEY, query, 20);

        call.enqueue(new Callback<GameResponse>() {
            @Override
            public void onResponse(Call<GameResponse> call, Response<GameResponse> response) {
                if (response.isSuccessful() && response.body() != null) {
                    callback.onSuccess(response.body().getResults());
                } else {
                    callback.onError("Erro na pesquisa: " + response.code());
                }
            }

            @Override
            public void onFailure(Call<GameResponse> call, Throwable t) {
                // Fallback para pesquisa local
                searchGamesLocally(query, callback);
            }
        });
    }

    /**
     * Pesquisa jogos localmente como fallback
     */
    private void searchGamesLocally(String query, GameLoadCallback callback) {
        Executors.newSingleThreadExecutor().execute(() -> {
            try {
                AppDatabase db = AppDatabase.getInstance(context);
                List<Game> games = db.gameDao().findGameWithName("%" + query + "%");

                if (context instanceof android.app.Activity) {
                    ((android.app.Activity) context).runOnUiThread(() ->
                            callback.onSuccess(games));
                }
            } catch (Exception e) {
                if (context instanceof android.app.Activity) {
                    ((android.app.Activity) context).runOnUiThread(() ->
                            callback.onError("Erro na pesquisa local"));
                }
            }
        });
    }

    /**
     * Força atualização do cache
     */
    public void forceRefresh(GameLoadCallback callback) {
        cacheManager.clearAllCaches();
        loadGamesFromApi(1, 20, null, null, callback);
    }
}