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
import android.widget.RatingBar;
import androidx.appcompat.widget.Toolbar;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.FragmentManager;

/**
 * Atividade que exibe os detalhes de um jogo específico
 */
public class GameDetailActivity extends AppCompatActivity {

    private Game game; // Jogo atual sendo exibido
    private Button wishlistButton; // Botão da lista de jogos desejados
    private boolean isInWishlist = false; // Estado atual na lista de jogos desejados

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_game_detail);

        // Inicializa o botão da lista de jogos desejados
        wishlistButton = findViewById(R.id.wishlist_button);

        // Configura a toolbar (barra superior)
        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);

        // Obtém o ID do jogo a partir do intent
        String gameId = getIntent().getStringExtra("GAME_ID");
        if (gameId == null || gameId.isEmpty()) {
            Log.e("GameDetail", "Nenhum ID de jogo fornecido");
            finish();
            return;
        }

        // Carrega o jogo da base de dados numa thread secundária
        loadGameData(gameId);
    }

    /**
     * Carrega os dados do jogo da base de dados
     */
    private void loadGameData(String gameId) {
        AppDatabase db = AppDatabase.getInstance(this);
        new Thread(() -> {
            game = db.gameDao().findGameById(gameId);

            runOnUiThread(() -> {
                if (game == null) {
                    Log.e("GameDetail", "Jogo não encontrado para o ID: " + gameId);
                    finish();
                    return;
                }
                setupUI(); // Configura a interface com os dados do jogo
            });
        }).start();
    }

    /**
     * Configura todos os elementos da interface com os dados do jogo
     */
    private void setupUI() {
        // Inicializa as views
        ImageView gameImage = findViewById(R.id.game_image);
        TextView gameName = findViewById(R.id.game_name);
        TextView gameStudio = findViewById(R.id.game_studio);
        RatingBar ratingBar = findViewById(R.id.game_rating_bar);
        TextView gameDescription = findViewById(R.id.game_description);
        LinearLayout platformsGroup = findViewById(R.id.platforms_group);
        LinearLayout genresGroup = findViewById(R.id.genres_group);

        // Define os dados do jogo nas views
        gameName.setText(game.getName());
        gameStudio.setText(game.getStudio());
        ratingBar.setRating(game.getRating());
        gameDescription.setText(game.getDescription());

        // Atualiza o título da toolbar
        if (getSupportActionBar() != null) {
            getSupportActionBar().setTitle(game.getName());
        }

        // Limpa as views existentes
        platformsGroup.removeAllViews();
        genresGroup.removeAllViews();

        // Adiciona botões para cada plataforma
        for (String platform : game.getPlatforms()) {
            Button platformButton = createFilterButton(platform);
            platformButton.setOnClickListener(v -> {
                navigateToBrowseWithFilter("platform", platform);
            });
            platformsGroup.addView(platformButton);
        }

        // Adiciona botões para cada género
        for (String genre : game.getGenres()) {
            Button genreButton = createFilterButton(genre);
            genreButton.setOnClickListener(v -> {
                navigateToBrowseWithFilter("genre", genre);
            });
            genresGroup.addView(genreButton);
        }

        // Define a imagem do jogo (usando o drawable)
        gameImage.setImageResource(getResources().getIdentifier(
                game.getImageUrl(),
                "drawable",
                getPackageName()
        ));

        // Verifica se o jogo está na lista de jogos desejados e atualiza o botão
        isInWishlist = WishlistManager.getInstance().isInWishlist(game);
        updateWishlistButton();

        // Configura o listener do botão da lista de jogos desejados
        wishlistButton.setOnClickListener(v -> {
            toggleWishlist();
        });
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
        isInWishlist = !isInWishlist;

        if (isInWishlist) {
            WishlistManager.getInstance().addToWishlist(game);
        } else {
            WishlistManager.getInstance().removeFromWishlist(game);
        }
        updateWishlistButton();
        notifyWishlistFragment();
    }

    /**
     * Atualiza o estado visual do botão da lista de desejos
     */
    private void updateWishlistButton() {
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
    }

    /**
     * Notifica o fragmento da lista de desejos para atualizar
     */
    private void notifyWishlistFragment() {
        FragmentManager fm = getSupportFragmentManager();
        WishlistFragment fragment = (WishlistFragment) fm.findFragmentById(R.id.nav_wishlist);
        if (fragment != null) {
            fragment.refreshWishlist();
        }
    }

    /**
     * Navega para a atividade principal com um filtro aplicado
     */
    private void navigateToBrowseWithFilter(String filterType, String filterValue) {
        Intent intent = new Intent(this, MainActivity.class);
        intent.putExtra("target_fragment", "browse");
        intent.putExtra("filter_type", filterType);
        intent.putExtra("filter_value", filterValue);
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        startActivity(intent);
        finish();
    }

    /**
     * Partilha o jogo atual
     */
    private void shareGame() {
        if (game == null) return;

        Intent shareIntent = new Intent(Intent.ACTION_SEND);
        shareIntent.setType("text/plain");
        shareIntent.putExtra(Intent.EXTRA_SUBJECT, "Check out this game!");
        shareIntent.putExtra(Intent.EXTRA_TEXT,
                "I found this amazing game: " + game.getName() +
                        " by " + game.getStudio() +
                        ". Rating: " + game.getRating() + "/5.0" +
                        "\n\n" + game.getDescription());

        startActivity(Intent.createChooser(shareIntent, "Share game via..."));
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
        }

        return super.onOptionsItemSelected(item);
    }
}