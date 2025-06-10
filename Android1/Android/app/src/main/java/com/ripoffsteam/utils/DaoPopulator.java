package com.ripoffsteam.utils;

import android.content.Context;
import android.util.Log;
import com.ripoffsteam.modelos.Game;
import java.util.List;

/**
 * Classe utilitária para popular o DAO com jogos da API
 */
public class DaoPopulator {
    private static final String TAG = "DaoPopulator";

    private ApiManager apiManager;
    private Context context;

    public DaoPopulator(Context context) {
        this.context = context;
        this.apiManager = new ApiManager(context);
    }

    /**
     * Interface para callback de população
     */
    public interface PopulationCallback {
        void onPopulationComplete(int totalGames);
        void onPopulationProgress(int currentPage, int totalPages, int gamesLoaded);
        void onPopulationError(String error);
    }

    /**
     * Popula o DAO com jogos de múltiplas páginas da API
     */
    public void populateDaoWithApiGames(int totalPages, PopulationCallback callback) {
        Log.d(TAG, "🚀 Iniciando população do DAO com " + totalPages + " páginas da API...");

        callback.onPopulationProgress(0, totalPages, 0);

        apiManager.loadMultiplePagesAndSave(totalPages, new ApiManager.GameLoadCallback() {
            @Override
            public void onSuccess(List<Game> games) {
                Log.d(TAG, "✅ População completa: " + games.size() + " jogos salvos no DAO");
                callback.onPopulationComplete(games.size());
            }

            @Override
            public void onError(String error) {
                Log.e(TAG, "❌ Erro na população: " + error);
                callback.onPopulationError(error);
            }
        });
    }

    /**
     * Popula o DAO com jogos de géneros específicos
     */
    public void populateDaoWithGenres(String[] genres, PopulationCallback callback) {
        Log.d(TAG, "🎯 Populando DAO com géneros específicos: " + String.join(", ", genres));

        final int totalGenres = genres.length;
        final int[] genresProcessed = {0};
        final List<Game> allGenreGames = new java.util.ArrayList<>();

        for (String genre : genres) {
            apiManager.loadGames(1, 20, genre, null, new ApiManager.GameLoadCallback() {
                @Override
                public void onSuccess(List<Game> games) {
                    synchronized (allGenreGames) {
                        allGenreGames.addAll(games);
                        genresProcessed[0]++;

                        Log.d(TAG, String.format("✅ Género processado (%d/%d): %s - %d jogos",
                                genresProcessed[0], totalGenres, genre, games.size()));

                        callback.onPopulationProgress(genresProcessed[0], totalGenres, allGenreGames.size());

                        if (genresProcessed[0] >= totalGenres) {
                            Log.d(TAG, "🎉 Todos os géneros processados: " + allGenreGames.size() + " jogos");
                            callback.onPopulationComplete(allGenreGames.size());
                        }
                    }
                }

                @Override
                public void onError(String error) {
                    synchronized (allGenreGames) {
                        genresProcessed[0]++;
                        Log.e(TAG, "❌ Erro no género " + genre + ": " + error);

                        if (genresProcessed[0] >= totalGenres) {
                            if (!allGenreGames.isEmpty()) {
                                callback.onPopulationComplete(allGenreGames.size());
                            } else {
                                callback.onPopulationError("Erro ao carregar todos os géneros");
                            }
                        }
                    }
                }
            });
        }
    }

    /**
     * Popula DAO incrementalmente (adiciona novos jogos sem remover existentes)
     */
    public void populateDaoIncremental(PopulationCallback callback) {
        Log.d(TAG, "📈 População incremental do DAO...");

        // Carrega página mais recente da API
        apiManager.loadGames(1, 40, null, null, new ApiManager.GameLoadCallback() {
            @Override
            public void onSuccess(List<Game> games) {
                Log.d(TAG, "✅ População incremental: " + games.size() + " novos jogos adicionados");
                callback.onPopulationComplete(games.size());
            }

            @Override
            public void onError(String error) {
                Log.e(TAG, "❌ Erro na população incremental: " + error);
                callback.onPopulationError(error);
            }
        });
    }

    /**
     * Popula com jogos populares (ordenados por rating)
     */
    public void populateWithPopularGames(PopulationCallback callback) {
        Log.d(TAG, "⭐ Populando com jogos populares...");

        // Usa ordenação da API (se disponível) ou carrega várias páginas
        apiManager.loadMultiplePagesAndSave(3, new ApiManager.GameLoadCallback() {
            @Override
            public void onSuccess(List<Game> games) {
                // Ordena por rating (mais populares primeiro)
                games.sort((g1, g2) -> Float.compare(g2.getRating(), g1.getRating()));

                Log.d(TAG, "⭐ Jogos populares carregados e ordenados: " + games.size());
                callback.onPopulationComplete(games.size());
            }

            @Override
            public void onError(String error) {
                callback.onPopulationError(error);
            }
        });
    }
}