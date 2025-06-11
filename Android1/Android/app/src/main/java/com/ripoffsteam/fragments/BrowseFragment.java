package com.ripoffsteam.fragments;

import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Spinner;
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
import java.util.Random;
import java.util.concurrent.atomic.AtomicInteger;

public class BrowseFragment extends Fragment {

    private RecyclerView gamesRecyclerView;
    private Spinner genreSpinner, platformSpinner, storeSpinner;
    private SwipeRefreshLayout swipeRefreshLayout;
    private GameAdapter gameAdapter;
    private GameDao gameDao;
    private AppDatabase db;
    private ApiManager apiManager;

    private int currentPage = 1;
    private boolean isLoading = false;
    private boolean isLastPage = false;
    private List<Game> allGames = new ArrayList<>();

    private String currentGenre = null;
    private String currentPlatform = null;
    private String currentStore = null;
    private Random random = new Random();

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        db = AppDatabase.getInstance(requireContext());
        gameDao = db.gameDao();

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

    private void initializeViews(View view) {
        gamesRecyclerView = view.findViewById(R.id.games_recycler);
        genreSpinner = view.findViewById(R.id.genre_spinner);
        platformSpinner = view.findViewById(R.id.platform_spinner);
        storeSpinner = view.findViewById(R.id.store_spinner);
        swipeRefreshLayout = view.findViewById(R.id.swipe_refresh);
    }

    private void setupRecyclerView() {
        LinearLayoutManager layoutManager = new LinearLayoutManager(getContext());
        gamesRecyclerView.setLayoutManager(layoutManager);

        gameAdapter = new GameAdapter(allGames, game -> {
            Intent intent = new Intent(getContext(), GameDetailActivity.class);
            intent.putExtra("GAME_ID", game.getId());
            startActivity(intent);
        });
        gamesRecyclerView.setAdapter(gameAdapter);

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

    private void setupSwipeRefresh() {
        swipeRefreshLayout.setOnRefreshListener(() -> {
            refreshWithDifferentGames();
        });

        swipeRefreshLayout.setColorSchemeResources(
                R.color.purple_500,
                R.color.purple_700,
                R.color.teal_200
        );

        swipeRefreshLayout.setDistanceToTriggerSync(300);
        swipeRefreshLayout.setProgressViewOffset(false, 0, 100);
    }

    private void refreshWithDifferentGames() {
        if (apiManager == null) {
            refreshWithLocalGames();
            return;
        }

        loadRandomPageRefresh();
    }

    private void loadRandomPageRefresh() {
        int randomPage = random.nextInt(50) + 1;

        apiManager.loadGames(randomPage, 20, null, null, new ApiManager.GameLoadCallback() {
            @Override
            public void onSuccess(List<Game> games) {
                requireActivity().runOnUiThread(() -> {
                    if (games != null && !games.isEmpty()) {
                        enrichGamesWithDeveloperInfo(games, enrichedGames -> {
                            handleRefreshSuccess(enrichedGames);
                        });
                    } else {
                        handleRefreshSuccess(games);
                    }
                });
            }

            @Override
            public void onError(String error) {
                requireActivity().runOnUiThread(() -> {
                    handleRefreshError();
                });
            }
        });
    }

    private void enrichGamesWithDeveloperInfo(List<Game> games, GameEnrichmentCallback callback) {
        if (games == null || games.isEmpty() || apiManager == null) {
            callback.onComplete(games);
            return;
        }

        List<Game> enrichedGames = new ArrayList<>(games);
        AtomicInteger completedRequests = new AtomicInteger(0);
        int totalGames = games.size();
        int maxConcurrentRequests = Math.min(5, totalGames);

        for (int i = 0; i < maxConcurrentRequests; i++) {
            final int index = i;
            final Game game = games.get(index);

            if (needsDeveloperInfo(game)) {
                enrichSingleGame(game, index, enrichedGames, completedRequests, totalGames, callback);
            } else {
                if (completedRequests.incrementAndGet() >= totalGames) {
                    callback.onComplete(enrichedGames);
                }
            }
        }

        for (int i = maxConcurrentRequests; i < totalGames; i++) {
            if (completedRequests.incrementAndGet() >= totalGames) {
                callback.onComplete(enrichedGames);
                break;
            }
        }
    }

    private void enrichSingleGame(Game game, int index, List<Game> enrichedGames,
                                  AtomicInteger completedRequests, int totalGames,
                                  GameEnrichmentCallback callback) {
        try {
            int gameId = Integer.parseInt(game.getId());

            apiManager.getGameDetails(gameId, new ApiManager.GameLoadCallback() {
                @Override
                public void onSuccess(List<Game> detailedGames) {
                    if (!detailedGames.isEmpty()) {
                        Game detailedGame = detailedGames.get(0);

                        Game updatedGame = new Game(
                                game.getId(),
                                game.getName(),
                                detailedGame.getDescription().isEmpty() ? game.getDescription() : detailedGame.getDescription(),
                                detailedGame.getStudio(),
                                game.getPlatforms(),
                                game.getGenres(),
                                game.getStores(),
                                game.getRating(),
                                game.getImageUrl(),
                                game.getScreenshots()
                        );

                        synchronized (enrichedGames) {
                            if (index < enrichedGames.size()) {
                                enrichedGames.set(index, updatedGame);
                            }
                        }

                        saveGameToDao(updatedGame);
                    }

                    if (completedRequests.incrementAndGet() >= totalGames) {
                        requireActivity().runOnUiThread(() -> {
                            callback.onComplete(enrichedGames);
                        });
                    }
                }

                @Override
                public void onError(String error) {
                    if (completedRequests.incrementAndGet() >= totalGames) {
                        requireActivity().runOnUiThread(() -> {
                            callback.onComplete(enrichedGames);
                        });
                    }
                }
            });
        } catch (NumberFormatException e) {
            if (completedRequests.incrementAndGet() >= totalGames) {
                requireActivity().runOnUiThread(() -> {
                    callback.onComplete(enrichedGames);
                });
            }
        }
    }

    private boolean needsDeveloperInfo(Game game) {
        String studio = game.getStudio();
        return studio == null ||
                studio.trim().isEmpty() ||
                studio.equals("Unknown Developer") ||
                studio.toLowerCase().contains("unknown");
    }

    private void saveGameToDao(Game game) {
        new Thread(() -> {
            try {
                db.gameDao().update(game);
            } catch (Exception e) {
                // Silent fail
            }
        }).start();
    }

    private interface GameEnrichmentCallback {
        void onComplete(List<Game> enrichedGames);
    }

    private void refreshWithLocalGames() {
        new Thread(() -> {
            try {
                List<Game> allLocalGames = gameDao.getAll();

                if (!allLocalGames.isEmpty()) {
                    List<Game> shuffledGames = new ArrayList<>(allLocalGames);
                    java.util.Collections.shuffle(shuffledGames, random);

                    int sampleSize = Math.min(20, shuffledGames.size());
                    List<Game> sampleGames = shuffledGames.subList(0, sampleSize);

                    requireActivity().runOnUiThread(() -> {
                        handleRefreshSuccess(sampleGames);
                    });
                } else {
                    requireActivity().runOnUiThread(() -> {
                        handleRefreshError();
                    });
                }

            } catch (Exception e) {
                requireActivity().runOnUiThread(() -> {
                    handleRefreshError();
                });
            }
        }).start();
    }

    private void handleRefreshSuccess(List<Game> newGames) {
        swipeRefreshLayout.setRefreshing(false);

        if (newGames != null && !newGames.isEmpty()) {
            allGames.clear();
            allGames.addAll(newGames);
            gameAdapter.notifyDataSetChanged();

            currentPage = 1;
            isLastPage = false;

            gamesRecyclerView.smoothScrollToPosition(0);
        }
    }

    private void handleRefreshError() {
        swipeRefreshLayout.setRefreshing(false);
        refreshWithLocalGames();
    }

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

    private void setupSpinner(Spinner spinner, List<String> items) {
        ArrayAdapter<String> adapter = new ArrayAdapter<>(
                requireContext(),
                android.R.layout.simple_spinner_item,
                items
        );
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinner.setAdapter(adapter);
    }

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

    private void updateCurrentFilters() {
        String selectedGenre = genreSpinner.getSelectedItem().toString();
        String selectedPlatform = platformSpinner.getSelectedItem().toString();
        String selectedStore = storeSpinner.getSelectedItem().toString();

        currentGenre = selectedGenre.startsWith("Todos") ? null : selectedGenre;
        currentPlatform = selectedPlatform.startsWith("Todas") ? null : selectedPlatform;
        currentStore = selectedStore.startsWith("Todas") ? null : selectedStore;
    }

    private void resetAndApplyFilters() {
        currentPage = 1;
        isLastPage = false;
        allGames.clear();
        gameAdapter.notifyDataSetChanged();

        applyFilters();
    }

    private void applyFilters() {
        new Thread(() -> {
            List<Game> filteredGames = gameDao.getFilteredGames(currentGenre, currentPlatform);

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
                            currentPage--;
                        });
                    }
                });
    }

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

    private void applyIncomingFilter(String filterType, String filterValue) {
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

    @Override
    public void onPause() {
        super.onPause();
        if (swipeRefreshLayout != null && swipeRefreshLayout.isRefreshing()) {
            swipeRefreshLayout.setRefreshing(false);
        }
    }
}