package com.ripoffsteam;

import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;
import com.ripoffsteam.DataBase.AppDatabase;
import com.ripoffsteam.fragments.WishlistFragment;
import com.ripoffsteam.modelos.Game;
import com.ripoffsteam.utils.WishlistManager;
import com.ripoffsteam.utils.AchievementManager;
import com.ripoffsteam.utils.ApiManager;
import android.widget.RatingBar;
import androidx.appcompat.widget.Toolbar;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.FragmentManager;

/**
 * Atividade que exibe os detalhes de um jogo específico
 * VERSÃO CORRIGIDA: Integrada com correções de géneros e descrições completas da API
 */
public class GameDetailActivity extends AppCompatActivity {

    private static final String TAG = "GameDetailActivity";

    private Game game; // Jogo atual sendo exibido
    private Button wishlistButton; // Botão da lista de jogos desejados
    private boolean isInWishlist = false; // Estado atual na lista de jogos desejados
    private AchievementManager achievementManager; // Gestor de conquistas
    private ApiManager apiManager; // Para carregar descrição completa da API
    private TextView gameDescription; // Referência para atualização dinâmica da descrição

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_game_detail);

        // Inicializa o gestor de conquistas
        achievementManager = new AchievementManager(this);

        // Inicializa ApiManager para carregar descrição completa
        apiManager = new ApiManager(this);

        // Inicializa o botão da lista de jogos desejados e referência da descrição
        wishlistButton = findViewById(R.id.wishlist_button);
        gameDescription = findViewById(R.id.game_description);

        // Configura a toolbar (barra superior)
        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        }

        // Obtém o ID do jogo a partir do intent
        String gameId = getIntent().getStringExtra("GAME_ID");
        if (gameId == null || gameId.isEmpty()) {
            Log.e(TAG, "❌ Nenhum ID de jogo fornecido");
            finish();
            return;
        }

        Log.d(TAG, "🎮 Abrindo detalhes do jogo ID: " + gameId);

        // Carrega o jogo da base de dados numa thread secundária
        loadGameData(gameId);
    }

    /**
     * Carrega os dados do jogo da base de dados
     */
    private void loadGameData(String gameId) {
        AppDatabase db = AppDatabase.getInstance(this);
        new Thread(() -> {
            try {
                game = db.gameDao().findGameById(gameId);

                runOnUiThread(() -> {
                    if (game == null) {
                        Log.e(TAG, "❌ Jogo não encontrado para o ID: " + gameId);
                        finish();
                        return;
                    }

                    Log.d(TAG, "✅ Jogo carregado: " + game.getName());
                    setupUI(); // Configura a interface com os dados do jogo

                    // Carrega descrição completa da API em background
                    loadCompleteDescriptionFromApi(gameId);

                    // Registra visualização do jogo para conquistas
                    achievementManager.recordGameView(gameId);
                });

            } catch (Exception e) {
                Log.e(TAG, "❌ Erro ao carregar jogo: " + e.getMessage());
                runOnUiThread(() -> finish());
            }
        }).start();
    }

    /**
     * Carrega descrição completa da API RAWG usando endpoint de detalhes
     */
    private void loadCompleteDescriptionFromApi(String gameId) {
        try {
            int gameIdInt = Integer.parseInt(gameId);
            Log.d(TAG, "🔍 Carregando descrição completa da RAWG API para jogo ID: " + gameIdInt);

            // Mostra indicador de carregamento
            if (gameDescription != null) {
                String currentDesc = gameDescription.getText().toString();
                if (currentDesc.length() < 50 || currentDesc.contains("Informações sobre este jogo não estão disponíveis")) {
                    gameDescription.setText("Carregando descrição completa da RAWG API...");
                }
            }

            apiManager.getGameDetails(gameIdInt, new ApiManager.GameLoadCallback() {
                @Override
                public void onSuccess(java.util.List<Game> games) {
                    if (!games.isEmpty()) {
                        Game gameWithFullDescription = games.get(0);

                        runOnUiThread(() -> {
                            updateGameWithApiData(gameWithFullDescription);
                        });
                    } else {
                        runOnUiThread(() -> {
                            Log.w(TAG, "⚠️ API não retornou dados para o jogo");
                            if (gameDescription != null && gameDescription.getText().toString().contains("Carregando")) {
                                gameDescription.setText(game.getDescription());
                            }
                        });
                    }
                }

                @Override
                public void onError(String error) {
                    runOnUiThread(() -> {
                        Log.w(TAG, "⚠️ Erro ao carregar descrição da API: " + error);
                        // Reverte para descrição original se estava carregando
                        if (gameDescription != null && gameDescription.getText().toString().contains("Carregando")) {
                            gameDescription.setText(game.getDescription());
                        }
                    });
                }
            });

        } catch (NumberFormatException e) {
            Log.e(TAG, "❌ ID de jogo inválido para conversão: " + gameId);
        }
    }

    /**
     * Atualiza a interface e DAO com dados mais completos da API
     */
    private void updateGameWithApiData(Game apiGame) {
        boolean hasUpdates = false;

        // Verifica se a descrição da API é melhor
        String apiDescription = apiGame.getDescription();
        String currentDescription = game.getDescription();

        if (apiDescription != null && !apiDescription.trim().isEmpty()) {
            // Verifica se a descrição da API é significativamente melhor
            boolean isBetter = false;

            if (currentDescription == null || currentDescription.trim().isEmpty()) {
                isBetter = true;
            } else if (currentDescription.contains("Informações sobre este jogo não estão disponíveis")) {
                isBetter = true;
            } else if (apiDescription.length() > currentDescription.length() + 50) {
                isBetter = true;
            } else if (currentDescription.length() < 100 && apiDescription.length() > 200) {
                isBetter = true;
            }

            if (isBetter) {
                Log.d(TAG, "✅ Descrição da API é melhor - atualizando interface");
                gameDescription.setText(apiDescription);

                // Atualiza o objeto game local
                game = new Game(
                        game.getId(),
                        game.getName(),
                        apiDescription,
                        game.getStudio(),
                        game.getPlatforms(),
                        game.getGenres(),
                        game.getStores(),
                        game.getRating(),
                        game.getImageUrl(),
                        game.getScreenshots()
                );

                hasUpdates = true;
            } else {
                Log.d(TAG, "ℹ️ Descrição atual é adequada, mantendo");
            }
        }

        // Atualiza outros campos se necessário
        if (!apiGame.getStudio().isEmpty() && !apiGame.getStudio().equals("Unknown Developer") &&
                (game.getStudio().isEmpty() || game.getStudio().equals("Unknown Developer"))) {

            TextView gameStudio = findViewById(R.id.game_studio);
            if (gameStudio != null) {
                gameStudio.setText(apiGame.getStudio());
                hasUpdates = true;
            }
        }

        // Se houve atualizações, salva no DAO
        if (hasUpdates) {
            updateGameInDao(game);
        }
    }

    /**
     * Atualiza o jogo no DAO com informações melhoradas
     */
    private void updateGameInDao(Game updatedGame) {
        new Thread(() -> {
            try {
                AppDatabase db = AppDatabase.getInstance(this);
                db.gameDao().update(updatedGame);
                Log.d(TAG, "✅ Jogo atualizado no DAO com informações da API");

            } catch (Exception e) {
                Log.e(TAG, "❌ Erro ao atualizar jogo no DAO: " + e.getMessage());
            }
        }).start();
    }

    /**
     * Configura todos os elementos da interface com os dados do jogo
     */
    private void setupUI() {
        try {
            // Inicializa as views
            ImageView gameImage = findViewById(R.id.game_image);
            TextView gameName = findViewById(R.id.game_name);
            TextView gameStudio = findViewById(R.id.game_studio);
            RatingBar ratingBar = findViewById(R.id.game_rating_bar);
            LinearLayout platformsGroup = findViewById(R.id.platforms_group);
            LinearLayout genresGroup = findViewById(R.id.genres_group);

            // Verifica se todas as views foram encontradas
            if (gameName == null || gameStudio == null || ratingBar == null ||
                    gameDescription == null || platformsGroup == null || genresGroup == null) {
                Log.e(TAG, "❌ Algumas views não foram encontradas no layout");
                return;
            }

            // Define os dados do jogo nas views
            gameName.setText(game.getName());
            gameStudio.setText(game.getStudio());
            ratingBar.setRating(game.getRating());

            // Define descrição inicial (será atualizada pela API se necessário)
            String initialDescription = game.getDescription();
            if (initialDescription == null || initialDescription.trim().isEmpty()) {
                gameDescription.setText("Descrição não disponível no momento.");
            } else {
                gameDescription.setText(initialDescription);
            }

            // Atualiza o título da toolbar
            if (getSupportActionBar() != null) {
                getSupportActionBar().setTitle(game.getName());
            }

            // Limpa as views existentes
            platformsGroup.removeAllViews();
            genresGroup.removeAllViews();

            // Adiciona botões para cada plataforma
            if (game.getPlatforms() != null && !game.getPlatforms().isEmpty()) {
                for (String platform : game.getPlatforms()) {
                    if (platform != null && !platform.trim().isEmpty()) {
                        Button platformButton = createFilterButton(platform);
                        platformButton.setOnClickListener(v -> {
                            navigateToBrowseWithFilter("platform", platform);
                        });
                        platformsGroup.addView(platformButton);
                    }
                }
            }

            // Adiciona botões para cada género
            if (game.getGenres() != null && !game.getGenres().isEmpty()) {
                for (String genre : game.getGenres()) {
                    if (genre != null && !genre.trim().isEmpty()) {
                        Button genreButton = createFilterButton(genre);
                        genreButton.setOnClickListener(v -> {
                            navigateToBrowseWithFilter("genre", genre);
                        });
                        genresGroup.addView(genreButton);
                    }
                }
            }

            // Define a imagem do jogo (usando placeholder por agora)
            if (gameImage != null) {
                gameImage.setImageResource(R.drawable.ic_game_placeholder);
            }

            // Verifica se o jogo está na lista de jogos desejados e atualiza o botão
            try {
                isInWishlist = WishlistManager.getInstance().isInWishlist(game);
                updateWishlistButton();

                // Configura o listener do botão da lista de jogos desejados
                wishlistButton.setOnClickListener(v -> toggleWishlist());

            } catch (Exception e) {
                Log.e(TAG, "❌ Erro ao configurar wishlist: " + e.getMessage());
            }

        } catch (Exception e) {
            Log.e(TAG, "❌ Erro ao configurar UI: " + e.getMessage());
        }
    }

    /**
     * Cria um botão estilizado para filtros
     */
    private Button createFilterButton(String text) {
        Button button = new Button(this);
        button.setText(text);
        button.setBackgroundResource(R.drawable.button_purple);
        button.setTextColor(Color.WHITE);

        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.WRAP_CONTENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
        );
        params.setMargins(0, 0, 8, 0);
        button.setLayoutParams(params);

        return button;
    }

    /**
     * Alterna o estado da wishlist
     */
    private void toggleWishlist() {
        try {
            isInWishlist = !isInWishlist;

            if (isInWishlist) {
                WishlistManager.getInstance().addToWishlist(game);
                Log.d(TAG, "✅ Jogo adicionado à wishlist: " + game.getName());
            } else {
                WishlistManager.getInstance().removeFromWishlist(game);
                Log.d(TAG, "🗑️ Jogo removido da wishlist: " + game.getName());
            }

            updateWishlistButton();
            notifyWishlistFragment();

            // Verifica conquistas relacionadas à wishlist
            int currentWishlistSize = WishlistManager.getInstance().getWishlist().size();
            achievementManager.checkWishlistAchievements(currentWishlistSize);

        } catch (Exception e) {
            Log.e(TAG, "❌ Erro ao alterar wishlist: " + e.getMessage());
        }
    }

    /**
     * Atualiza o estado visual do botão da lista de desejos
     */
    private void updateWishlistButton() {
        if (wishlistButton == null) return;

        try {
            if (isInWishlist) {
                wishlistButton.setText(R.string.remove_from_wishlist);
                wishlistButton.setCompoundDrawablesWithIntrinsicBounds(
                        ContextCompat.getDrawable(this, R.drawable.ic_favorite),
                        null, null, null);
            } else {
                wishlistButton.setText(R.string.add_to_wishlist);
                wishlistButton.setCompoundDrawablesWithIntrinsicBounds(
                        ContextCompat.getDrawable(this, R.drawable.ic_favorite_border),
                        null, null, null);
            }
        } catch (Exception e) {
            Log.e(TAG, "❌ Erro ao atualizar botão wishlist: " + e.getMessage());
        }
    }

    /**
     * Notifica o fragmento da lista de desejos para atualizar
     */
    private void notifyWishlistFragment() {
        try {
            FragmentManager fm = getSupportFragmentManager();
            WishlistFragment fragment = (WishlistFragment) fm.findFragmentById(R.id.nav_wishlist);
            if (fragment != null) {
                fragment.refreshWishlist();
            }
        } catch (Exception e) {
            Log.e(TAG, "❌ Erro ao notificar wishlist fragment: " + e.getMessage());
        }
    }

    /**
     * Navega para a atividade principal com um filtro aplicado
     */
    private void navigateToBrowseWithFilter(String filterType, String filterValue) {
        try {
            Log.d(TAG, "🔍 Navegando para browse com filtro: " + filterType + " = " + filterValue);

            Intent intent = new Intent(this, MainActivity.class);
            intent.putExtra("target_fragment", "browse");
            intent.putExtra("filter_type", filterType);
            intent.putExtra("filter_value", filterValue);
            intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
            startActivity(intent);
            finish();

        } catch (Exception e) {
            Log.e(TAG, "❌ Erro ao navegar com filtro: " + e.getMessage());
        }
    }

    /**
     * Partilha o jogo atual
     */
    private void shareGame() {
        if (game == null) {
            Log.w(TAG, "⚠️ Tentativa de partilhar jogo nulo");
            return;
        }

        try {
            Intent shareIntent = new Intent(Intent.ACTION_SEND);
            shareIntent.setType("text/plain");
            shareIntent.putExtra(Intent.EXTRA_SUBJECT, "Check out this game!");

            // Monta texto de partilha com informações do jogo
            StringBuilder shareText = new StringBuilder();
            shareText.append("I found this amazing game: ").append(game.getName());

            if (!game.getStudio().isEmpty() && !game.getStudio().equals("Unknown Developer")) {
                shareText.append(" by ").append(game.getStudio());
            }

            shareText.append(". Rating: ").append(game.getRating()).append("/5.0");

            // Adiciona descrição se disponível (limitada para partilha)
            String description = game.getDescription();
            if (description != null && !description.trim().isEmpty() &&
                    !description.contains("Informações sobre este jogo não estão disponíveis") &&
                    description.length() > 20) {

                String shortDesc = description.length() > 150 ?
                        description.substring(0, 147) + "..." : description;
                shareText.append("\n\n").append(shortDesc);
            }

            shareIntent.putExtra(Intent.EXTRA_TEXT, shareText.toString());
            startActivity(Intent.createChooser(shareIntent, "Share game via..."));

            // Registra partilha para conquistas
            achievementManager.recordGameShare(game.getId());

            Log.d(TAG, "✅ Jogo partilhado: " + game.getName());

        } catch (Exception e) {
            Log.e(TAG, "❌ Erro ao partilhar jogo: " + e.getMessage());
        }
    }

    /**
     * Força recarregamento da descrição da API
     */
    private void refreshGameDescription() {
        if (game != null && gameDescription != null) {
            Log.d(TAG, "🔄 Forçando atualização da descrição...");
            gameDescription.setText("Atualizando descrição da RAWG API...");
            loadCompleteDescriptionFromApi(game.getId());
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.game_detail_menu, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        int id = item.getItemId();

        if (id == android.R.id.home) {
            // Botão de voltar na toolbar
            onBackPressed();
            return true;
        } else if (id == R.id.action_share) {
            // Partilhar jogo
            shareGame();
            return true;
        } else if (id == R.id.action_refresh_description) {
            // Atualizar descrição da API
            refreshGameDescription();
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        // Limpa referências para evitar memory leaks
        apiManager = null;
        gameDescription = null;
        game = null;
        achievementManager = null;
    }
}