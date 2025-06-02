package com.ripoffsteam;

import android.content.Intent;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.SearchView;
import androidx.core.view.GravityCompat;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.appcompat.widget.Toolbar;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;
import com.google.android.material.navigation.NavigationView;
import com.ripoffsteam.DataBase.AppDatabase;
import com.ripoffsteam.fragments.BrowseFragment;
import com.ripoffsteam.fragments.HomeFragment;
import com.ripoffsteam.fragments.PreferencesFragment;
import com.ripoffsteam.fragments.WishlistFragment;
import com.ripoffsteam.modelos.Game;
import com.ripoffsteam.utils.JsonLoader;
import java.util.List;
import java.util.concurrent.Executors;
 //Atividade principal que serve como container para os fragmentos
 //Implementa a interface NavigationView.OnNavigationItemSelectedListener
 //para lidar com eventos do menu de navegação

public class MainActivity extends AppCompatActivity implements NavigationView.OnNavigationItemSelectedListener {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Carrega os jogos do ficheiro JSON para a base de dados
        // usando uma thread separada para não bloquear a UI
        Executors.newSingleThreadExecutor().execute(() -> {
            AppDatabase db = AppDatabase.getInstance(this);
            List<Game> games = JsonLoader.loadGames(this);
            if (games != null && games.size() > 0) {
                db.gameDao().insertAll(games); // Insere todos os jogos na BD
            }
        });

        // Configuração da Toolbar
        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        // Configuração do Navigation Drawer
        DrawerLayout drawerLayout = findViewById(R.id.drawer_layout);
        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(
                this,
                drawerLayout,
                toolbar,
                R.string.nav_open_drawer,
                R.string.nav_close_drawer
        );
        drawerLayout.addDrawerListener(toggle);
        toggle.syncState();

        // Configura o listener para os itens do menu de navegação
        NavigationView navigationView = findViewById(R.id.nav_view);
        navigationView.setNavigationItemSelectedListener(this);

        // Carrega o fragmento inicial (HomeFragment)
        if (savedInstanceState == null) {
            loadFragment(new HomeFragment(), false);
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.main_menu, menu);

        // Configura a funcionalidade de pesquisa
        MenuItem searchItem = menu.findItem(R.id.action_search);
        SearchView searchView = (SearchView) searchItem.getActionView();

        searchView.setOnQueryTextListener(new SearchView.OnQueryTextListener() {
            @Override
            public boolean onQueryTextSubmit(String query) {
                searchGameAndNavigate(query);
                // Fecha a view de pesquisa após submissão
                searchItem.collapseActionView();
                return true;
            }

            @Override
            public boolean onQueryTextChange(String newText) {
                return false;
            }
        });

        return true;
    }


     //Pesquisa um jogo pelo nome e navega para os seus detalhes

    private void searchGameAndNavigate(String gameName) {
        // Pesquisa na base de dados numa thread separada
        new Thread(() -> {
            AppDatabase db = AppDatabase.getInstance(this);
            Game foundGame = db.gameDao().findGameByName(gameName);

            runOnUiThread(() -> {
                if (foundGame != null) {
                    // Navega para a atividade de detalhe do jogo
                    Intent intent = new Intent(MainActivity.this, GameDetailActivity.class);
                    intent.putExtra("GAME_ID", foundGame.getId());
                    startActivity(intent);
                } else {
                    Toast.makeText(MainActivity.this,
                            "Jogo não encontrado: " + gameName,
                            Toast.LENGTH_SHORT).show();
                }
            });
        }).start();
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        int id = item.getItemId();

        if (id == R.id.action_settings) {
            // Navega para o fragmento de preferências
            getSupportFragmentManager().beginTransaction()
                    .replace(R.id.fragment_container, new PreferencesFragment())
                    .addToBackStack(null)
                    .commit();
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

    @Override
    public boolean onNavigationItemSelected(@NonNull MenuItem item) {
        Fragment fragment = null;
        int id = item.getItemId();

        // Determina qual fragmento carregar com base no item selecionado
        if (id == R.id.nav_home) {
            fragment = new HomeFragment();
        } else if (id == R.id.nav_browse) {
            fragment = new BrowseFragment();
        } else if (id == R.id.nav_wishlist) {
            fragment = new WishlistFragment();
        } else {
            fragment = new HomeFragment();
        }

        if (fragment != null) {
            // Substitui o fragmento atual
            FragmentTransaction fragmentTransaction = getSupportFragmentManager().beginTransaction();
            fragmentTransaction.replace(R.id.fragment_container, fragment);
            fragmentTransaction.addToBackStack(null);
            fragmentTransaction.commit();
        }

        // Fecha o menu de navegação
        DrawerLayout drawerLayout = findViewById(R.id.drawer_layout);
        drawerLayout.closeDrawer(GravityCompat.START);
        return true;
    }

    @Override
    public void onBackPressed() {
        // Verifica se o menu de navegação está aberto
        DrawerLayout drawer = findViewById(R.id.drawer_layout);
        if (drawer.isDrawerOpen(GravityCompat.START)) {
            drawer.closeDrawer(GravityCompat.START); // Fecha o menu
        } else {
            super.onBackPressed(); // Comportamento padrão
        }
    }

    private void loadFragment(Fragment fragment, boolean addToBackStack) {
        FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();
        transaction.replace(R.id.fragment_container, fragment);

        if (addToBackStack) {
            transaction.addToBackStack(null);
        }

        transaction.commit();
    }
}