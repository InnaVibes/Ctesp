package com.ripoffsteam.utils;

import android.content.Context;
import android.util.Log;
import com.ripoffsteam.modelos.Game;
import java.util.ArrayList;
import java.util.List;

/**
 * Classe utilitária para popular o DAO com jogos da API RAWG
 * Versão atualizada para trabalhar com a nova estrutura
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
     * Popula o DAO com jogos de múltiplas páginas da API RAWG
     */
    public void populateDaoWithApiGames(int totalPages, PopulationCallback callback) {
        Log.d(TAG, "🚀 Iniciando população do DAO com " + totalPages + " páginas da RAWG API...");

        if (!apiManager.isApiKeyConfigured()) {
            callback.onPopulationError("API Key não configurada");
            return;
        }

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
     * Popula o DAO com jogos de géneros específicos da RAWG
     */
    public void populateDaoWithGenres(String[] genreSlugs, PopulationCallback callback) {
        Log.d(TAG, "🎯 Populando DAO com géneros específicos: " + String.join(", ", genreSlugs));

        if (!apiManager.isApiKeyConfigured()) {
            callback.onPopulationError("API Key não configurada");
            return;
        }

        final int totalGenres = genreSlugs.length;
        final int[] genresProcessed = {0};
        final List<Game> allGenreGames = new ArrayList<>();

        for (String genreSlug : genreSlugs) {
            apiManager.loadGamesByGenre(genreSlug, 15, new ApiManager.GameLoadCallback() {
                @Override
                public void onSuccess(List<Game> games) {
                    synchronized (allGenreGames) {
                        allGenreGames.addAll(games);
                        genresProcessed[0]++;

                        Log.d(TAG, String.format("✅ Género processado (%d/%d): %s - %d jogos",
                                genresProcessed[0], totalGenres, genreSlug, games.size()));

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
                        Log.e(TAG, "❌ Erro no género " + genreSlug + ": " + error);

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

        if (!apiManager.isApiKeyConfigured()) {
            callback.onPopulationError("API Key não configurada");
            return;
        }

        // Carrega página mais recente da API
        apiManager.loadGames(1, 40, null, null, new ApiManager.GameLoadCallback() {
            @Override
            public void onSuccess(List<Game> games) {
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
     * Popula com jogos populares ordenados por rating
     */
    public void populateWithPopularGames(PopulationCallback callback) {
        Log.d(TAG, "⭐ Populando com jogos populares da RAWG...");

        if (!apiManager.isApiKeyConfigured()) {
            callback.onPopulationError("API Key não configurada");
            return;
        }

        apiManager.loadPopularGames(40, new ApiManager.GameLoadCallback() {
            @Override
            public void onSuccess(List<Game> games) {
                Log.d(TAG, "⭐ Jogos populares carregados: " + games.size());
                callback.onPopulationComplete(games.size());
            }

            @Override
            public void onError(String error) {
                Log.e(TAG, "❌ Erro ao carregar jogos populares: " + error);
                callback.onPopulationError(error);
            }
        });
    }

    /**
     * Popula com jogos recentes
     */
    public void populateWithRecentGames(PopulationCallback callback) {
        Log.d(TAG, "🆕 Populando com jogos recentes da RAWG...");

        if (!apiManager.isApiKeyConfigured()) {
            callback.onPopulationError("API Key não configurada");
            return;
        }

        apiManager.loadRecentGames(40, new ApiManager.GameLoadCallback() {
            @Override
            public void onSuccess(List<Game> games) {
                Log.d(TAG, "🆕 Jogos recentes carregados: " + games.size());
                callback.onPopulationComplete(games.size());
            }

            @Override
            public void onError(String error) {
                Log.e(TAG, "❌ Erro ao carregar jogos recentes: " + error);
                callback.onPopulationError(error);
            }
        });
    }

    /**
     * Popula com uma mistura balanceada de jogos
     */
    public void populateWithMixedContent(PopulationCallback callback) {
        Log.d(TAG, "🎲 Populando com conteúdo misto da RAWG...");

        if (!apiManager.isApiKeyConfigured()) {
            callback.onPopulationError("API Key não configurada");
            return;
        }

        final List<Game> allGames = new ArrayList<>();
        final int[] tasksCompleted = {0};
        final int totalTasks = 3; // Popular, Recent, Random

        // Jogos populares
        apiManager.loadPopularGames(20, new ApiManager.GameLoadCallback() {
            @Override
            public void onSuccess(List<Game> games) {
                synchronized (allGames) {
                    allGames.addAll(games);
                    tasksCompleted[0]++;
                    callback.onPopulationProgress(tasksCompleted[0], totalTasks, allGames.size());

                    if (tasksCompleted[0] >= totalTasks) {
                        callback.onPopulationComplete(allGames.size());
                    }
                }
            }

            @Override
            public void onError(String error) {
                synchronized (allGames) {
                    tasksCompleted[0]++;
                    if (tasksCompleted[0] >= totalTasks) {
                        if (!allGames.isEmpty()) {
                            callback.onPopulationComplete(allGames.size());
                        } else {
                            callback.onPopulationError("Erro ao carregar conteúdo misto");
                        }
                    }
                }
            }
        });

        // Jogos recentes
        apiManager.loadRecentGames(20, new ApiManager.GameLoadCallback() {
            @Override
            public void onSuccess(List<Game> games) {
                synchronized (allGames) {
                    allGames.addAll(games);
                    tasksCompleted[0]++;
                    callback.onPopulationProgress(tasksCompleted[0], totalTasks, allGames.size());

                    if (tasksCompleted[0] >= totalTasks) {
                        callback.onPopulationComplete(allGames.size());
                    }
                }
            }

            @Override
            public void onError(String error) {
                synchronized (allGames) {
                    tasksCompleted[0]++;
                    if (tasksCompleted[0] >= totalTasks) {
                        if (!allGames.isEmpty()) {
                            callback.onPopulationComplete(allGames.size());
                        } else {
                            callback.onPopulationError("Erro ao carregar conteúdo misto");
                        }
                    }
                }
            }
        });

        // Jogos aleatórios (página aleatória)
        int randomPage = (int) (Math.random() * 10) + 1;
        apiManager.loadGames(randomPage, 20, null, null, new ApiManager.GameLoadCallback() {
            @Override
            public void onSuccess(List<Game> games) {
                synchronized (allGames) {
                    allGames.addAll(games);
                    tasksCompleted[0]++;
                    callback.onPopulationProgress(tasksCompleted[0], totalTasks, allGames.size());

                    if (tasksCompleted[0] >= totalTasks) {
                        callback.onPopulationComplete(allGames.size());
                    }
                }
            }

            @Override
            public void onError(String error) {
                synchronized (allGames) {
                    tasksCompleted[0]++;
                    if (tasksCompleted[0] >= totalTasks) {
                        if (!allGames.isEmpty()) {
                            callback.onPopulationComplete(allGames.size());
                        } else {
                            callback.onPopulationError("Erro ao carregar conteúdo misto");
                        }
                    }
                }
            }
        });
    }

    /**
     * Popula por plataformas específicas
     */
    public void populateByPlatforms(String[] platformSlugs, PopulationCallback callback) {
        Log.d(TAG, "🖥️ Populando por plataformas: " + String.join(", ", platformSlugs));

        if (!apiManager.isApiKeyConfigured()) {
            callback.onPopulationError("API Key não configurada");
            return;
        }

        final int totalPlatforms = platformSlugs.length;
        final int[] platformsProcessed = {0};
        final List<Game> allPlatformGames = new ArrayList<>();

        for (String platformSlug : platformSlugs) {
            apiManager.loadGamesByPlatform(platformSlug, 15, new ApiManager.GameLoadCallback() {
                @Override
                public void onSuccess(List<Game> games) {
                    synchronized (allPlatformGames) {
                        allPlatformGames.addAll(games);
                        platformsProcessed[0]++;

                        Log.d(TAG, String.format("✅ Plataforma processada (%d/%d): %s - %d jogos",
                                platformsProcessed[0], totalPlatforms, platformSlug, games.size()));

                        callback.onPopulationProgress(platformsProcessed[0], totalPlatforms, allPlatformGames.size());

                        if (platformsProcessed[0] >= totalPlatforms) {
                            Log.d(TAG, "🎉 Todas as plataformas processadas: " + allPlatformGames.size() + " jogos");
                            callback.onPopulationComplete(allPlatformGames.size());
                        }
                    }
                }

                @Override
                public void onError(String error) {
                    synchronized (allPlatformGames) {
                        platformsProcessed[0]++;
                        Log.e(TAG, "❌ Erro na plataforma " + platformSlug + ": " + error);

                        if (platformsProcessed[0] >= totalPlatforms) {
                            if (!allPlatformGames.isEmpty()) {
                                callback.onPopulationComplete(allPlatformGames.size());
                            } else {
                                callback.onPopulationError("Erro ao carregar todas as plataformas");
                            }
                        }
                    }
                }
            });
        }
    }

    /**
     * Testa a população com apenas alguns jogos
     */
    public void testPopulation(PopulationCallback callback) {
        Log.d(TAG, "🧪 Testando população com poucos jogos...");

        if (!apiManager.isApiKeyConfigured()) {
            callback.onPopulationError("API Key não configurada");
            return;
        }

        apiManager.loadGames(1, 5, null, null, new ApiManager.GameLoadCallback() {
            @Override
            public void onSuccess(List<Game> games) {
                Log.d(TAG, "🧪 Teste concluído: " + games.size() + " jogos");
                callback.onPopulationComplete(games.size());
            }

            @Override
            public void onError(String error) {
                Log.e(TAG, "❌ Erro no teste: " + error);
                callback.onPopulationError(error);
            }
        });
    }

    /**
     * Obtém estatísticas da população atual
     */
    public void getPopulationStats(StatsCallback callback) {
        apiManager.getDaoStats(new ApiManager.StatisticsCallback() {
            @Override
            public void onStatsLoaded(int totalGames) {
                callback.onStatsReady(totalGames);
            }
        });
    }

    /**
     * Interface para estatísticas
     */
    public interface StatsCallback {
        void onStatsReady(int totalGames);
    }

    /**
     * Limpa e repopula completamente o DAO
     */
    public void clearAndRepopulate(int pages, PopulationCallback callback) {
        Log.d(TAG, "🗑️ Limpando e repopulando DAO...");

        // Força refresh que limpa cache e recarrega
        apiManager.forceRefresh(new ApiManager.GameLoadCallback() {
            @Override
            public void onSuccess(List<Game> games) {
                // Após o refresh, carrega páginas adicionais
                if (pages > 1) {
                    populateDaoWithApiGames(pages - 1, callback);
                } else {
                    callback.onPopulationComplete(games.size());
                }
            }

            @Override
            public void onError(String error) {
                callback.onPopulationError("Erro na limpeza: " + error);
            }
        });
    }

    /**
     * Verifica se a API está acessível antes de popular
     */
    public void verifyAndPopulate(int pages, PopulationCallback callback) {
        Log.d(TAG, "🔍 Verificando API antes de popular...");

        apiManager.testApiConnection(new ApiManager.TestCallback() {
            @Override
            public void onSuccess(String message) {
                Log.d(TAG, "✅ API verificada, iniciando população...");
                populateDaoWithApiGames(pages, callback);
            }

            @Override
            public void onError(String error) {
                Log.e(TAG, "❌ Falha na verificação da API: " + error);
                callback.onPopulationError("API não acessível: " + error);
            }
        });
    }
}