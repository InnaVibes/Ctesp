package com.ripoffsteam;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.app.AppCompatDelegate;
import androidx.appcompat.widget.SearchView;
import androidx.core.view.GravityCompat;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.appcompat.widget.Toolbar;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;
import androidx.preference.PreferenceManager;
import com.google.android.material.navigation.NavigationView;
import com.ripoffsteam.DataBase.AppDatabase;
import com.ripoffsteam.fragments.BrowseFragment;
import com.ripoffsteam.fragments.HomeFragment;
import com.ripoffsteam.fragments.PreferencesFragment;
import com.ripoffsteam.fragments.WishlistFragment;
import com.ripoffsteam.modelos.Game;
import com.ripoffsteam.utils.WishlistManager;
import com.ripoffsteam.utils.ApiManager;
import com.ripoffsteam.utils.DaoPopulator;
import com.ripoffsteam.notifications.NotificationScheduler;

import java.util.List;
import java.util.concurrent.Executors;

public class MainActivity extends AppCompatActivity implements NavigationView.OnNavigationItemSelectedListener {

    private static final String TAG = "MainActivity";
    private ApiManager apiManager;
    private boolean isLoadingGames = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        try {
            // Aplica tema antes de chamar super.onCreate()
            applyThemeFromPreferences();

            super.onCreate(savedInstanceState);
            setContentView(R.layout.activity_main);

            initializeServices();
            setupUI();

            // Carrega jogos da RAWG API para o DAO automaticamente
            loadApiGamesIntoDao();

            handleIncomingIntent();

            if (savedInstanceState == null) {
                loadFragment(new HomeFragment(), false);
            }

        } catch (Exception e) {
            Log.e(TAG, "Error in onCreate", e);
            Toast.makeText(this, "Erro ao inicializar app", Toast.LENGTH_LONG).show();
        }
    }

    private void applyThemeFromPreferences() {
        try {
            SharedPreferences prefs = PreferenceManager.getDefaultSharedPreferences(this);
            String theme = prefs.getString(getString(R.string.pref_theme_key), "system");

            switch (theme) {
                case "light":
                    AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO);
                    break;
                case "dark":
                    AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_YES);
                    break;
                case "system":
                default:
                    AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_FOLLOW_SYSTEM);
                    break;
            }
        } catch (Exception e) {
            Log.e(TAG, "Error applying theme", e);
        }
    }

    private void loadApiGamesIntoDao() {
                isLoadingGames = true;

        try {
            // Inicializa o ApiManager para RAWG API
            apiManager = new ApiManager(this);

            // Verifica se a API key está configurada
            if (!apiManager.isApiKeyConfigured()) {
                Log.e(TAG, "❌ API Key da RAWG não configurada!");
                Toast.makeText(this, "❌ Configure a API Key da RAWG no ApiManager", Toast.LENGTH_LONG).show();
                isLoadingGames = false;
                return;
            }

            Log.d(TAG, "🚀 INICIANDO carregamento de jogos da RAWG API para o DAO...");
            Log.d(TAG, "🔑 API Key: " + apiManager.getMaskedApiKey());
            Toast.makeText(this, "A carregar jogos", Toast.LENGTH_LONG).show();

            // Primeiro verifica se já há jogos no DAO
            checkDaoContentAndLoad();

        } catch (Exception e) {
            Log.e(TAG, "❌ Erro ao iniciar carregamento de jogos", e);
            Toast.makeText(this, "Erro ao conectar com a RAWG API", Toast.LENGTH_LONG).show();
            isLoadingGames = false;
        }
    }

    /**
     * Verifica o conteúdo atual do DAO e decide como carregar
     */
    private void checkDaoContentAndLoad() {
        Executors.newSingleThreadExecutor().execute(() -> {
            try {
                AppDatabase db = AppDatabase.getInstance(this);
                List<Game> existingGames = db.gameDao().getAll();

                runOnUiThread(() -> {
                    Log.d(TAG, "📊 DAO atual contém " + existingGames.size() + " jogos");

                    if (existingGames.size() < 20) {
                        // Se há poucos jogos, carrega múltiplas páginas da API
                        Log.d(TAG, "📥 Poucos jogos no DAO, carregando da RAWG API...");
                        loadMultiplePagesFromApi();
                    } else {
                        // Se já há jogos suficientes, apenas atualiza com conteúdo novo
                        Log.d(TAG, "🔄 DAO já populado, fazendo atualização incremental...");
                        loadIncrementalUpdate();
                    }
                });

            } catch (Exception e) {
                Log.e(TAG, "❌ Erro ao verificar DAO", e);
                runOnUiThread(() -> {
                    // Em caso de erro, carrega uma página da API
                    loadSinglePageFromApi();
                });
            }
        });
    }

    /**
     * Carrega múltiplas páginas da RAWG API para popular o DAO
     */
    private void loadMultiplePagesFromApi() {
        Log.d(TAG, "📚 Carregando múltiplas páginas da RAWG API...");

        DaoPopulator populator = new DaoPopulator(this);

        // Primeiro testa a conexão e depois carrega
        populator.verifyAndPopulate(3, new DaoPopulator.PopulationCallback() {
            @Override
            public void onPopulationComplete(int totalGames) {
                runOnUiThread(() -> {
                    Log.d(TAG, "✅ SUCESSO: " + totalGames + " jogos carregados da RAWG API para o DAO");
                    Toast.makeText(MainActivity.this,
                            "✅ " + totalGames + " jogos carregados da RAWG API!",
                            Toast.LENGTH_SHORT).show();
                    isLoadingGames = false;

                    // Carrega conteúdo adicional variado
                    loadMixedContent();
                });
            }

            @Override
            public void onPopulationProgress(int currentPage, int totalPages, int gamesLoaded) {
                runOnUiThread(() -> {
                    String progress = String.format("📄 Página %d/%d (%d jogos)",
                            currentPage, totalPages, gamesLoaded);
                    Log.d(TAG, progress);

                    // Atualiza toast com progresso
                    if (currentPage > 0) {
                        Toast.makeText(MainActivity.this, progress, Toast.LENGTH_SHORT).show();
                    }
                });
            }

            @Override
            public void onPopulationError(String error) {
                runOnUiThread(() -> {
                    Log.e(TAG, "❌ ERRO no carregamento múltiplo: " + error);
                    Toast.makeText(MainActivity.this,
                            "❌ Erro ao carregar jogos: " + error,
                            Toast.LENGTH_LONG).show();
                    isLoadingGames = false;

                    // Em caso de erro, tenta carregar pelo menos uma página
                    loadSinglePageFromApi();
                });
            }
        });
    }

    /**
     * Carrega apenas uma página da RAWG API (fallback)
     */
    private void loadSinglePageFromApi() {
        Log.d(TAG, "📄 Carregando uma página da RAWG API como fallback...");

        apiManager.loadGames(1, 30, null, null, new ApiManager.GameLoadCallback() {
            @Override
            public void onSuccess(List<Game> games) {
                Log.d(TAG, "✅ Página única carregada: " + games.size() + " jogos");
                Toast.makeText(MainActivity.this,
                        "✅ " + games.size() + " jogos carregados",
                        Toast.LENGTH_SHORT).show();
                isLoadingGames = false;
            }

            @Override
            public void onError(String error) {
                Log.e(TAG, "❌ ERRO na página única: " + error);
                Toast.makeText(MainActivity.this,
                        "❌ Erro: " + error,
                        Toast.LENGTH_LONG).show();
                isLoadingGames = false;
            }
        });
    }

    /**
     * Atualização incremental (adiciona novos jogos)
     */
    private void loadIncrementalUpdate() {
        Log.d(TAG, "🔄 Fazendo atualização incremental...");

        DaoPopulator populator = new DaoPopulator(this);

        populator.populateDaoIncremental(new DaoPopulator.PopulationCallback() {
            @Override
            public void onPopulationComplete(int newGames) {
                runOnUiThread(() -> {
                    Log.d(TAG, "🔄 Atualização incremental completa: " + newGames + " novos jogos");
                    if (newGames > 0) {
                        Toast.makeText(MainActivity.this,
                                "📈 " + newGames + " novos jogos adicionados",
                                Toast.LENGTH_SHORT).show();
                    } else {
                        Toast.makeText(MainActivity.this,
                                "✅ Base de dados atualizada",
                                Toast.LENGTH_SHORT).show();
                    }
                    isLoadingGames = false;
                });
            }

            @Override
            public void onPopulationProgress(int current, int total, int loaded) {
                // Progress para atualização incremental
                Log.d(TAG, "🔄 Progresso incremental: " + loaded + " jogos");
            }

            @Override
            public void onPopulationError(String error) {
                runOnUiThread(() -> {
                    Log.e(TAG, "❌ Erro na atualização incremental: " + error);
                    Toast.makeText(MainActivity.this,
                            "Falha na atualização: " + error,
                            Toast.LENGTH_SHORT).show();
                    isLoadingGames = false;
                });
            }
        });
    }

    /**
     * Carrega conteúdo misto para mais variedade
     */
    private void loadMixedContent() {
        Log.d(TAG, "🎲 Carregando conteúdo misto para variedade...");

        DaoPopulator populator = new DaoPopulator(this);

        populator.populateWithMixedContent(new DaoPopulator.PopulationCallback() {
            @Override
            public void onPopulationComplete(int totalGames) {
                runOnUiThread(() -> {
                    Log.d(TAG, "🎯 Conteúdo misto carregado: " + totalGames + " jogos adicionais");
                    Toast.makeText(MainActivity.this,
                            "🎯 +" + totalGames + " jogos variados adicionados",
                            Toast.LENGTH_SHORT).show();
                });
            }

            @Override
            public void onPopulationProgress(int current, int total, int loaded) {
                Log.d(TAG, String.format("🎲 Progresso misto: %d/%d (%d jogos)", current, total, loaded));
            }

            @Override
            public void onPopulationError(String error) {
                Log.e(TAG, "❌ Erro no conteúdo misto: " + error);
                // Não mostra erro para o usuário pois é conteúdo adicional
            }
        });
    }

    /**
     * Configura a interface de usuário
     */
    private void setupUI() {
        try {
            Toolbar toolbar = findViewById(R.id.toolbar);
            setSupportActionBar(toolbar);

            DrawerLayout drawerLayout = findViewById(R.id.drawer_layout);
            ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(
                    this, drawerLayout, toolbar,
                    R.string.nav_open_drawer, R.string.nav_close_drawer);
            drawerLayout.addDrawerListener(toggle);
            toggle.syncState();

            NavigationView navigationView = findViewById(R.id.nav_view);
            navigationView.setNavigationItemSelectedListener(this);
        } catch (Exception e) {
            Log.e(TAG, "Error in setupUI", e);
        }
    }

    /**
     * Lida com intents vindos de outras activities
     */
    private void handleIncomingIntent() {
        try {
            Intent intent = getIntent();
            if (intent != null) {
                String targetFragment = intent.getStringExtra("target_fragment");
                if ("browse".equals(targetFragment)) {
                    BrowseFragment browseFragment = new BrowseFragment();

                    Bundle args = new Bundle();
                    String filterType = intent.getStringExtra("filter_type");
                    String filterValue = intent.getStringExtra("filter_value");
                    if (filterType != null && filterValue != null) {
                        args.putString("filter_type", filterType);
                        args.putString("filter_value", filterValue);
                        browseFragment.setArguments(args);
                    }

                    loadFragment(browseFragment, false);
                }
            }
        } catch (Exception e) {
            Log.e(TAG, "Error handling incoming intent", e);
        }
    }

    /**
     * Pesquisa por jogo usando RAWG API
     */
    private void searchGameAndNavigate(String gameName) {
        try {
            if (apiManager != null) {
                Toast.makeText(this, "🔍 Pesquisando na RAWG: " + gameName, Toast.LENGTH_SHORT).show();

                apiManager.searchGames(gameName, new ApiManager.GameLoadCallback() {
                    @Override
                    public void onSuccess(List<Game> games) {
                        runOnUiThread(() -> {
                            if (!games.isEmpty()) {
                                Game foundGame = games.get(0);
                                Toast.makeText(MainActivity.this,
                                        "✅ Encontrado: " + foundGame.getName(),
                                        Toast.LENGTH_SHORT).show();

                                Intent intent = new Intent(MainActivity.this, GameDetailActivity.class);
                                intent.putExtra("GAME_ID", foundGame.getId());
                                startActivity(intent);
                            } else {
                                Toast.makeText(MainActivity.this,
                                        "❌ Nenhum jogo encontrado para: " + gameName,
                                        Toast.LENGTH_SHORT).show();
                            }
                        });
                    }

                    @Override
                    public void onError(String error) {
                        runOnUiThread(() -> {
                            Toast.makeText(MainActivity.this,
                                    "❌ Erro na pesquisa: " + error,
                                    Toast.LENGTH_SHORT).show();
                        });
                    }
                });
            }
        } catch (Exception e) {
            Log.e(TAG, "Error in searchGameAndNavigate", e);
            Toast.makeText(this, "Erro na pesquisa", Toast.LENGTH_SHORT).show();
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        try {
            getMenuInflater().inflate(R.menu.main_menu, menu);

            MenuItem searchItem = menu.findItem(R.id.action_search);
            SearchView searchView = (SearchView) searchItem.getActionView();

            searchView.setOnQueryTextListener(new SearchView.OnQueryTextListener() {
                @Override
                public boolean onQueryTextSubmit(String query) {
                    searchGameAndNavigate(query);
                    searchItem.collapseActionView();
                    return true;
                }

                @Override
                public boolean onQueryTextChange(String newText) {
                    return false;
                }
            });

            return true;
        } catch (Exception e) {
            Log.e(TAG, "Error creating options menu", e);
            return false;
        }
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        try {
            int id = item.getItemId();

            if (id == R.id.action_settings) {
                // Abre fragmento de configurações
                getSupportFragmentManager().beginTransaction()
                        .replace(R.id.fragment_container, new PreferencesFragment())
                        .addToBackStack(null)
                        .commit();
                return true;
            }

        } catch (Exception e) {
            Log.e(TAG, "Error in onOptionsItemSelected", e);
        }

        return super.onOptionsItemSelected(item);
    }

    /**
     * Testa a conexão com a RAWG API
     */
    private void testRawgApiConnection() {
        if (apiManager != null) {
            Toast.makeText(this, "🔌 Testando conexão com RAWG API...", Toast.LENGTH_SHORT).show();

            apiManager.testApiConnection(new ApiManager.TestCallback() {
                @Override
                public void onSuccess(String message) {
                    runOnUiThread(() -> {
                        Toast.makeText(MainActivity.this,
                                "✅ RAWG API: " + message,
                                Toast.LENGTH_SHORT).show();

                        // Mostra informações de debug
                        apiManager.getDebugInfo();
                    });
                }

                @Override
                public void onError(String error) {
                    runOnUiThread(() -> {
                        Toast.makeText(MainActivity.this,
                                "❌ RAWG API: " + error,
                                Toast.LENGTH_LONG).show();
                    });
                }
            });
        } else {
            Toast.makeText(this, "❌ ApiManager não inicializado", Toast.LENGTH_SHORT).show();
        }
    }

    /**
     * Obtém e mostra estatísticas da base de dados
     */
    private void showDatabaseStats() {
        if (apiManager != null) {
            apiManager.getDaoStats(new ApiManager.StatisticsCallback() {
                @Override
                public void onStatsLoaded(int totalGames) {
                    runOnUiThread(() -> {
                        String message = String.format("📊 Base de dados: %d jogos", totalGames);
                        Toast.makeText(MainActivity.this, message, Toast.LENGTH_SHORT).show();
                        Log.d(TAG, message);
                    });
                }
            });
        } else {
            Toast.makeText(this, "❌ ApiManager não inicializado", Toast.LENGTH_SHORT).show();
        }
    }

    /**
     * Carrega jogos por categoria específica
     */
    private void loadGamesByCategory(String category) {
        if (apiManager == null) {
            Toast.makeText(this, "❌ ApiManager não inicializado", Toast.LENGTH_SHORT).show();
            return;
        }

        Toast.makeText(this, "🎯 Carregando jogos de " + category + "...", Toast.LENGTH_SHORT).show();

        ApiManager.GameLoadCallback callback = new ApiManager.GameLoadCallback() {
            @Override
            public void onSuccess(List<Game> games) {
                runOnUiThread(() -> {
                    String message = String.format("✅ Carregados %d jogos de %s", games.size(), category);
                    Toast.makeText(MainActivity.this, message, Toast.LENGTH_SHORT).show();
                    Log.d(TAG, message);
                });
            }

            @Override
            public void onError(String error) {
                runOnUiThread(() -> {
                    Toast.makeText(MainActivity.this,
                            "❌ Erro ao carregar " + category + ": " + error,
                            Toast.LENGTH_SHORT).show();
                });
            }
        };

        switch (category.toLowerCase()) {
            case "popular":
                apiManager.loadPopularGames(20, callback);
                break;
            case "action":
                apiManager.loadGamesByGenre("action", 20, callback);
                break;
            case "rpg":
                apiManager.loadGamesByGenre("role-playing-games-rpg", 20, callback);
                break;
            case "pc":
                apiManager.loadGamesByPlatform("pc", 20, callback);
                break;
            default:
                apiManager.loadGames(1, 20, null, null, callback);
                break;
        }
    }

    @Override
    public boolean onNavigationItemSelected(@NonNull MenuItem item) {
        try {
            Fragment fragment = null;
            int id = item.getItemId();

            if (id == R.id.nav_home) {
                fragment = new HomeFragment();
            } else if (id == R.id.nav_browse) {
                fragment = new BrowseFragment();
            } else if (id == R.id.nav_wishlist) {
                fragment = new WishlistFragment();
            } else if (id == R.id.nav_achievements) {
                fragment = new com.ripoffsteam.fragments.AchievementsFragment();
            } else {
                fragment = new HomeFragment();
            }

            if (fragment != null) {
                loadFragment(fragment, true);
            }

            DrawerLayout drawerLayout = findViewById(R.id.drawer_layout);
            drawerLayout.closeDrawer(GravityCompat.START);
            return true;
        } catch (Exception e) {
            Log.e(TAG, "Error in onNavigationItemSelected", e);
            return false;
        }
    }

    @Override
    public void onBackPressed() {
        try {
            DrawerLayout drawer = findViewById(R.id.drawer_layout);
            if (drawer.isDrawerOpen(GravityCompat.START)) {
                drawer.closeDrawer(GravityCompat.START);
            } else {
                super.onBackPressed();
            }
        } catch (Exception e) {
            Log.e(TAG, "Error in onBackPressed", e);
            super.onBackPressed();
        }
    }

    /**
     * Carrega um fragmento no container principal
     */
    private void loadFragment(Fragment fragment, boolean addToBackStack) {
        try {
            FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();
            transaction.replace(R.id.fragment_container, fragment);

            if (addToBackStack) {
                transaction.addToBackStack(null);
            }

            transaction.commit();
        } catch (Exception e) {
            Log.e(TAG, "Error loading fragment", e);
        }
    }

    /**
     * Inicializa serviços da aplicação
     */
    private void initializeServices() {
        try {
            // Initialize WishlistManager
            WishlistManager.getInstance(this);

            // Schedule daily notifications se estiver habilitado
            SharedPreferences prefs = PreferenceManager.getDefaultSharedPreferences(this);
            boolean notificationsEnabled = prefs.getBoolean(getString(R.string.pref_notification_key), true);

            if (notificationsEnabled) {
                NotificationScheduler.scheduleDailyNotification(this);
            }
        } catch (Exception e) {
            Log.e(TAG, "Error initializing services", e);
        }
    }

    /**
     * Método público para partilhar um jogo
     */
    public static void shareGame(AppCompatActivity activity, Game game) {
        try {
            Intent shareIntent = new Intent(Intent.ACTION_SEND);
            shareIntent.setType("text/plain");
            shareIntent.putExtra(Intent.EXTRA_SUBJECT, "Check out this game!");
            shareIntent.putExtra(Intent.EXTRA_TEXT,
                    "I found this amazing game: " + game.getName() +
                            " by " + game.getStudio() +
                            ". Rating: " + game.getRating() + "/5.0" +
                            "\n\n" + game.getDescription());

            activity.startActivity(Intent.createChooser(shareIntent, "Share game via..."));
        } catch (Exception e) {
            Log.e("MainActivity", "Error sharing game", e);
        }
    }

    /**
     * Obtém o ApiManager para uso em outros componentes
     */
    public ApiManager getApiManager() {
        return apiManager;
    }

    /**
     * Método público para verificar se está carregando jogos
     */
    public boolean isLoadingGames() {
        return isLoadingGames;
    }
}