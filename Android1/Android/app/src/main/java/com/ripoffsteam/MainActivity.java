package com.ripoffsteam;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
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
import com.ripoffsteam.utils.JsonLoader;
import com.ripoffsteam.utils.WishlistManager;
import com.ripoffsteam.utils.ApiManager;
import com.ripoffsteam.notifications.NotificationScheduler;

import java.util.List;
import java.util.concurrent.Executors;

public class MainActivity extends AppCompatActivity implements NavigationView.OnNavigationItemSelectedListener {

    private ApiManager apiManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // APLICAR TEMA ANTES DE CHAMAR super.onCreate()
        applyThemeFromPreferences();

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        initializeServices();
        loadInitialData();
        setupUI();
        handleIncomingIntent();

        if (savedInstanceState == null) {
            loadFragment(new HomeFragment(), false);
        }
    }

    /**
     * Aplica o tema baseado nas preferências salvas
     */
    private void applyThemeFromPreferences() {
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
    }

    /**
     * Carrega dados iniciais da aplicação
     */
    private void loadInitialData() {
        // Inicializa o ApiManager
        apiManager = new ApiManager(this);

        Executors.newSingleThreadExecutor().execute(() -> {
            AppDatabase db = AppDatabase.getInstance(this);
            List<Game> existingGames = db.gameDao().getAll();

            if (existingGames.isEmpty()) {
                // Se não há jogos na BD, carrega do JSON primeiro (dados de exemplo)
                List<Game> games = JsonLoader.loadGames(this);
                if (games != null && !games.isEmpty()) {
                    db.gameDao().insertAll(games);
                }

                // Depois tenta carregar da API RAWG
                loadGamesFromApi();
            } else {
                // Se há jogos, verifica se precisa atualizar da API
                loadGamesFromApi();
            }
        });
    }

    /**
     * Carrega jogos da API RAWG
     */
    private void loadGamesFromApi() {
        apiManager.loadGames(1, getPageSize(), null, null, new ApiManager.GameLoadCallback() {
            @Override
            public void onSuccess(List<Game> games) {
                runOnUiThread(() -> {
                    // Opcional: mostrar toast de sucesso
                    // Toast.makeText(MainActivity.this, "Jogos atualizados", Toast.LENGTH_SHORT).show();
                });
            }

            @Override
            public void onError(String error) {
                runOnUiThread(() -> {
                    // Só mostra erro se não houver jogos em cache
                    AppDatabase db = AppDatabase.getInstance(MainActivity.this);
                    Executors.newSingleThreadExecutor().execute(() -> {
                        List<Game> cachedGames = db.gameDao().getAll();
                        if (cachedGames.isEmpty()) {
                            runOnUiThread(() ->
                                    Toast.makeText(MainActivity.this,
                                            "Erro ao carregar jogos: " + error,
                                            Toast.LENGTH_LONG).show());
                        }
                    });
                });
            }
        });
    }

    /**
     * Obtém o tamanho da página das configurações
     */
    private int getPageSize() {
        SharedPreferences prefs = PreferenceManager.getDefaultSharedPreferences(this);
        return prefs.getInt(getString(R.string.pref_page_size_key), 20);
    }

    /**
     * Configura a interface de usuário
     */
    private void setupUI() {
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
    }

    /**
     * Lida com intents vindos de outras activities (ex: filtros)
     */
    private void handleIncomingIntent() {
        Intent intent = getIntent();
        if (intent != null) {
            String targetFragment = intent.getStringExtra("target_fragment");
            if ("browse".equals(targetFragment)) {
                BrowseFragment browseFragment = new BrowseFragment();

                // Passa filtros se existirem
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
    }

    /**
     * Pesquisa por jogo usando API ou base de dados
     */
    private void searchGameAndNavigate(String gameName) {
        apiManager.searchGames(gameName, new ApiManager.GameLoadCallback() {
            @Override
            public void onSuccess(List<Game> games) {
                runOnUiThread(() -> {
                    if (!games.isEmpty()) {
                        Game foundGame = games.get(0); // Pega o primeiro resultado
                        Intent intent = new Intent(MainActivity.this, GameDetailActivity.class);
                        intent.putExtra("GAME_ID", foundGame.getId());
                        startActivity(intent);
                    } else {
                        Toast.makeText(MainActivity.this,
                                "Jogo não encontrado: " + gameName,
                                Toast.LENGTH_SHORT).show();
                    }
                });
            }

            @Override
            public void onError(String error) {
                runOnUiThread(() -> {
                    Toast.makeText(MainActivity.this,
                            "Erro na pesquisa: " + error,
                            Toast.LENGTH_SHORT).show();
                });
            }
        });
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
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

        // Adiciona item para forçar refresh
        MenuItem refreshItem = menu.add(0, R.id.action_refresh, 0, "Atualizar");
        refreshItem.setShowAsAction(MenuItem.SHOW_AS_ACTION_NEVER);

        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        int id = item.getItemId();

        if (id == R.id.action_settings) {
            getSupportFragmentManager().beginTransaction()
                    .replace(R.id.fragment_container, new PreferencesFragment())
                    .addToBackStack(null)
                    .commit();
            return true;
        } else if (id == R.id.action_refresh) {
            // Força refresh dos dados
            apiManager.forceRefresh(new ApiManager.GameLoadCallback() {
                @Override
                public void onSuccess(List<Game> games) {
                    runOnUiThread(() ->
                            Toast.makeText(MainActivity.this,
                                    "Dados atualizados (" + games.size() + " jogos)",
                                    Toast.LENGTH_SHORT).show());
                }

                @Override
                public void onError(String error) {
                    runOnUiThread(() ->
                            Toast.makeText(MainActivity.this,
                                    "Erro ao atualizar: " + error,
                                    Toast.LENGTH_SHORT).show());
                }
            });
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

    @Override
    public boolean onNavigationItemSelected(@NonNull MenuItem item) {
        Fragment fragment = null;
        int id = item.getItemId();

        if (id == R.id.nav_home) {
            fragment = new HomeFragment();
        } else if (id == R.id.nav_browse) {
            fragment = new BrowseFragment();
        } else if (id == R.id.nav_wishlist) {
            fragment = new WishlistFragment();
        } else if (id == R.id.nav_achievements) {
            // Adiciona navegação para conquistas
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
    }

    @Override
    public void onBackPressed() {
        DrawerLayout drawer = findViewById(R.id.drawer_layout);
        if (drawer.isDrawerOpen(GravityCompat.START)) {
            drawer.closeDrawer(GravityCompat.START);
        } else {
            super.onBackPressed();
        }
    }

    /**
     * Carrega um fragmento no container principal
     */
    private void loadFragment(Fragment fragment, boolean addToBackStack) {
        FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();
        transaction.replace(R.id.fragment_container, fragment);

        if (addToBackStack) {
            transaction.addToBackStack(null);
        }

        transaction.commit();
    }

    /**
     * Inicializa serviços da aplicação
     */
    private void initializeServices() {
        // Initialize WishlistManager
        WishlistManager.getInstance(this);

        // Schedule daily notifications se estiver habilitado
        SharedPreferences prefs = PreferenceManager.getDefaultSharedPreferences(this);
        boolean notificationsEnabled = prefs.getBoolean(getString(R.string.pref_notification_key), true);

        if (notificationsEnabled) {
            NotificationScheduler.scheduleDailyNotification(this);
        }
    }

    /**
     * Método público para partilhar um jogo (chamado de outras activities)
     */
    public static void shareGame(AppCompatActivity activity, Game game) {
        Intent shareIntent = new Intent(Intent.ACTION_SEND);
        shareIntent.setType("text/plain");
        shareIntent.putExtra(Intent.EXTRA_SUBJECT, "Check out this game!");
        shareIntent.putExtra(Intent.EXTRA_TEXT,
                "I found this amazing game: " + game.getName() +
                        " by " + game.getStudio() +
                        ". Rating: " + game.getRating() + "/5.0" +
                        "\n\n" + game.getDescription());

        activity.startActivity(Intent.createChooser(shareIntent, "Share game via..."));
    }

    /**
     * Obtém o ApiManager para uso em outros componentes
     */
    public ApiManager getApiManager() {
        return apiManager;
    }
}