package com.ripoffsteam.fragments;

import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Spinner;
import android.widget.Toast;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;
import com.ripoffsteam.DA0.GameDao;
import com.ripoffsteam.DataBase.AppDatabase;
import com.ripoffsteam.GameDetailActivity;
import com.ripoffsteam.MainActivity;
import com.ripoffsteam.R;
import com.ripoffsteam.adapters.GameAdapter;
import com.ripoffsteam.modelos.Game;
import com.ripoffsteam.utils.ApiManager;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Fragmento para navegar e filtrar jogos com paginação
 */
public class BrowseFragment extends Fragment {
    private RecyclerView gamesRecyclerView;
    private Spinner genreSpinner, platformSpinner, storeSpinner;
    private SwipeRefreshLayout swipeRefreshLayout;
    private GameAdapter gameAdapter;
    private GameDao gameDao;
    private AppDatabase db;
    private ApiManager apiManager;

    // Controle de paginação
    private int currentPage = 1;
    private boolean isLoading = false;
    private boolean isLastPage = false;
    private List<Game> allGames = new ArrayList<>();

    // Filtros atuais
    private String currentGenre = null;
    private String currentPlatform = null;
    private String currentStore = null;

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        db = AppDatabase.getInstance(requireContext());
        gameDao = db.gameDao();

        // Obtém ApiManager da MainActivity
        if (getActivity() instanceof MainActivity) {
            apiManager = ((MainActivity) getActivity()).getApiManager();
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_browse, container, false);

        initializeViews(view);
        setupRecyclerView();
        setupSwipeRefresh();
        loadGamesAndSetupSpinners();
        setupSpinnerListeners();
        checkForIncomingFilters();

        return view;
    }

    /**
     * Inicializa as views do layout
     */
    private void initializeViews(View view) {
        gamesRecyclerView = view.findViewById(R.id.games_recycler);
        genreSpinner = view.findViewById(R.id.genre_spinner);
        platformSpinner = view.findViewById(R.id.platform_spinner);
        storeSpinner = view.findViewById(R.id.store_spinner);
        swipeRefreshLayout = view.findViewById(R.id.swipe_refresh);
    }

    /**
     * Configura o RecyclerView com scroll infinito
     */
    private void setupRecyclerView() {
        LinearLayoutManager layoutManager = new LinearLayoutManager(getContext());
        gamesRecyclerView.setLayoutManager(layoutManager);

        gameAdapter = new GameAdapter(allGames, game -> {
            Intent intent = new Intent(getContext(), GameDetailActivity.class);
            intent.putExtra("GAME_ID", game.getId());
            startActivity(intent);
        });
        gamesRecyclerView.setAdapter(gameAdapter);

        // Adiciona scroll listener para paginação
        gamesRecyclerView.addOnScrollListener(new RecyclerView.OnScrollListener() {
            @Override
            public void onScrolled(RecyclerView recyclerView, int dx, int dy) {
                super.onScrolled(recyclerView, dx, dy);

                int visibleItemCount = layoutManager.getChildCount();
                int totalItemCount = layoutManager.getItemCount();
                int firstVisibleItemPosition = layoutManager.findFirstVisibleItemPosition();

                if (!isLoading && !isLastPage) {
                    if ((visibleItemCount + firstVisibleItemPosition) >= totalItemCount
                            && firstVisibleItemPosition >= 0) {
                        loadMoreGames();
                    }
                }
            }
        });
    }

    /**
     * Configura o SwipeRefreshLayout
     */
    private void setupSwipeRefresh() {
        swipeRefreshLayout.setOnRefreshListener(() -> {
            refreshGames();
        });
        swipeRefreshLayout.setColorSchemeResources(
                R.color.purple_500,
                R.color.purple_700,
                R.color.teal_200
        );
    }

    /**
     * Carrega jogos e configura os spinners de filtro
     */
    private void loadGamesAndSetupSpinners() {
        new Thread(() -> {
            List<Game> games = gameDao.getAll();

            Set<String> genres = new HashSet<>();
            Set<String> platforms = new HashSet<>();
            Set<String> stores = new HashSet<>();

            for (Game game : games) {
                if (game.getGenres() != null) genres.addAll(game.getGenres());
                if (game.getPlatforms() != null) platforms.addAll(game.getPlatforms());
                if (game.getStores() != null) stores.addAll(game.getStores());
            }

            List<String> genreList = new ArrayList<>(genres);
            genreList.add(0, "Todos os Géneros");
            List<String> platformList = new ArrayList<>(platforms);
            platformList.add(0, "Todas as Plataformas");
            List<String> storeList = new ArrayList<>(stores);
            storeList.add(0, "Todas as Lojas");

            requireActivity().runOnUiThread(() -> {
                setupSpinner(genreSpinner, genreList);
                setupSpinner(platformSpinner, platformList);
                setupSpinner(storeSpinner, storeList);

                allGames.clear();
                allGames.addAll(games);
                gameAdapter.notifyDataSetChanged();
            });
        }).start();
    }

    /**
     * Configura um spinner com a lista fornecida
     */
    private void setupSpinner(Spinner spinner, List<String> items) {
        ArrayAdapter<String> adapter = new ArrayAdapter<>(
                requireContext(),
                android.R.layout.simple_spinner_item,
                items
        );
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinner.setAdapter(adapter);
    }

    /**
     * Configura os listeners dos spinners
     */
    private void setupSpinnerListeners() {
        AdapterView.OnItemSelectedListener listener = new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                updateCurrentFilters();
                resetAndApplyFilters();
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {}
        };

        genreSpinner.setOnItemSelectedListener(listener);
        platformSpinner.setOnItemSelectedListener(listener);
        storeSpinner.setOnItemSelectedListener(listener);
    }

    /**
     * Atualiza os filtros atuais baseado nas seleções dos spinners
     */
    private void updateCurrentFilters() {
        String selectedGenre = genreSpinner.getSelectedItem().toString();
        String selectedPlatform = platformSpinner.getSelectedItem().toString();
        String selectedStore = storeSpinner.getSelectedItem().toString();

        currentGenre = selectedGenre.startsWith("Todos") ? null : selectedGenre;
        currentPlatform = selectedPlatform.startsWith("Todas") ? null : selectedPlatform;
        currentStore = selectedStore.startsWith("Todas") ? null : selectedStore;
    }

    /**
     * Reseta a paginação e aplica filtros
     */
    private void resetAndApplyFilters() {
        currentPage = 1;
        isLastPage = false;
        allGames.clear();
        gameAdapter.notifyDataSetChanged();

        applyFilters();
    }

    /**
     * Aplica os filtros selecionados
     */
    private void applyFilters() {
        new Thread(() -> {
            List<Game> filteredGames = gameDao.getFilteredGames(currentGenre, currentPlatform);

            // Aplica filtro de loja se necessário (com verificação de API level)
            if (currentStore != null) {
                List<Game> storeFilteredGames = new ArrayList<>();
                for (Game game : filteredGames) {
                    if (game.getStores() != null && game.getStores().contains(currentStore)) {
                        storeFilteredGames.add(game);
                    }
                }
                filteredGames = storeFilteredGames;
            }

            List<Game> finalFilteredGames = filteredGames;
            requireActivity().runOnUiThread(() -> {
                allGames.clear();
                allGames.addAll(finalFilteredGames);
                gameAdapter.notifyDataSetChanged();
            });
        }).start();
    }

    /**
     * Carrega mais jogos para paginação
     */
    private void loadMoreGames() {
        if (isLoading || apiManager == null) return;

        isLoading = true;
        currentPage++;

        apiManager.loadGames(currentPage, 20, currentGenre, currentPlatform,
                new ApiManager.GameLoadCallback() {
                    @Override
                    public void onSuccess(List<Game> games) {
                        requireActivity().runOnUiThread(() -> {
                            isLoading = false;

                            if (games.isEmpty()) {
                                isLastPage = true;
                            } else {
                                int startPosition = allGames.size();
                                allGames.addAll(games);
                                gameAdapter.notifyItemRangeInserted(startPosition, games.size());
                            }
                        });
                    }

                    @Override
                    public void onError(String error) {
                        requireActivity().runOnUiThread(() -> {
                            isLoading = false;
                            currentPage--; // Reverte a página em caso de erro
                            Toast.makeText(getContext(),
                                    "Erro ao carregar mais jogos: " + error,
                                    Toast.LENGTH_SHORT).show();
                        });
                    }
                });
    }

    /**
     * Atualiza a lista de jogos (pull-to-refresh)
     */
    private void refreshGames() {
        if (apiManager == null) {
            swipeRefreshLayout.setRefreshing(false);
            return;
        }

        apiManager.forceRefresh(new ApiManager.GameLoadCallback() {
            @Override
            public void onSuccess(List<Game> games) {
                requireActivity().runOnUiThread(() -> {
                    swipeRefreshLayout.setRefreshing(false);
                    currentPage = 1;
                    isLastPage = false;

                    // Recarrega spinners e aplicar filtros
                    loadGamesAndSetupSpinners();

                    Toast.makeText(getContext(),
                            "Lista atualizada",
                            Toast.LENGTH_SHORT).show();
                });
            }

            @Override
            public void onError(String error) {
                requireActivity().runOnUiThread(() -> {
                    swipeRefreshLayout.setRefreshing(false);
                    Toast.makeText(getContext(),
                            "Erro ao atualizar: " + error,
                            Toast.LENGTH_SHORT).show();
                });
            }
        });
    }

    /**
     * Verifica se há filtros vindos de outras activities
     */
    private void checkForIncomingFilters() {
        Bundle args = getArguments();
        if (args != null) {
            String filterType = args.getString("filter_type");
            String filterValue = args.getString("filter_value");

            if (filterType != null && filterValue != null) {
                applyIncomingFilter(filterType, filterValue);
            }
        }
    }

    /**
     * Aplica filtro vindo de outra activity
     */
    private void applyIncomingFilter(String filterType, String filterValue) {
        // Aguarda os spinners serem configurados
        gamesRecyclerView.post(() -> {
            switch (filterType) {
                case "genre":
                    setSpinnerSelection(genreSpinner, filterValue);
                    break;
                case "platform":
                    setSpinnerSelection(platformSpinner, filterValue);
                    break;
                case "store":
                    setSpinnerSelection(storeSpinner, filterValue);
                    break;
            }
        });
    }

    /**
     * Define a seleção de um spinner
     */
    private void setSpinnerSelection(Spinner spinner, String value) {
        @SuppressWarnings("unchecked")
        ArrayAdapter<String> adapter = (ArrayAdapter<String>) spinner.getAdapter();
        if (adapter != null) {
            int position = adapter.getPosition(value);
            if (position >= 0) {
                spinner.setSelection(position);
            }
        }
    }
}