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
import com.ripoffsteam.DA0.GameDao;
import com.ripoffsteam.DataBase.AppDatabase;
import com.ripoffsteam.GameDetailActivity;
import com.ripoffsteam.R;
import com.ripoffsteam.adapters.GameAdapter;
import com.ripoffsteam.modelos.Game;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

//Fragmento para navegar e filtrar jogos

public class BrowseFragment extends Fragment {
    private RecyclerView gamesRecyclerView;
    private Spinner genreSpinner, platformSpinner; // Spinners para filtros
    private GameAdapter gameAdapter;
    private GameDao gameDao;
    private AppDatabase db;

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Obtém a instância da base de dados e do DAO
        db = AppDatabase.getInstance(requireContext());
        gameDao = db.gameDao();
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_browse, container, false);


        gamesRecyclerView = view.findViewById(R.id.games_recycler);
        genreSpinner = view.findViewById(R.id.genre_spinner);
        platformSpinner = view.findViewById(R.id.platform_spinner);

        // Configura a RecyclerView
        gamesRecyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        gameAdapter = new GameAdapter(new ArrayList<>(), game -> {
            // Lida com o clique num jogo
            Intent intent = new Intent(getContext(), GameDetailActivity.class);
            intent.putExtra("GAME_ID", game.getId());
            startActivity(intent);
        });
        gamesRecyclerView.setAdapter(gameAdapter);

        // Carrega os jogos e configura os spinners
        loadGamesAndSetupSpinners();

        // Configura os listeners dos spinners
        setupSpinnerListeners();

        return view;
    }


     //Carrega os jogos da base do DAO e configura os spinners dos filtros

    private void loadGamesAndSetupSpinners() {
        new Thread(() -> {
            // Obtém todos os jogos da base de dados
            List<Game> allGames = gameDao.getAll();

            Set<String> genres = new HashSet<>();
            Set<String> platforms = new HashSet<>();

            for (Game game : allGames) {
                genres.addAll(game.getGenres());
                platforms.addAll(game.getPlatforms());
            }

            List<String> genreList = new ArrayList<>(genres);
            genreList.add(0, "All");
            List<String> platformList = new ArrayList<>(platforms);
            platformList.add(0, "All");

            // Atualiza a UI na thread principal
            requireActivity().runOnUiThread(() -> {
                // Configura o adapter do spinner de géneros
                ArrayAdapter<String> genreAdapter = new ArrayAdapter<>(
                        requireContext(), android.R.layout.simple_spinner_item, genreList);
                genreSpinner.setAdapter(genreAdapter);

                // Configura o adapter do spinner de plataformas
                ArrayAdapter<String> platformAdapter = new ArrayAdapter<>(
                        requireContext(), android.R.layout.simple_spinner_item, platformList);
                platformSpinner.setAdapter(platformAdapter);

                // Atualiza a lista de jogos
                gameAdapter.updateGames(allGames);
            });
        }).start();
    }


    //Configura os listeners para os spinners de filtro

    private void setupSpinnerListeners() {
        AdapterView.OnItemSelectedListener listener = new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                // Aplica os filtros quando uma seleção é feita
                applyFilters();
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {}
        };

        // Aplica o listener a ambos os spinners
        genreSpinner.setOnItemSelectedListener(listener);
        platformSpinner.setOnItemSelectedListener(listener);
    }


    //Aplica os filtros selecionados e atualiza a lista de jogos

    private void applyFilters() {
        // Obtém os valores selecionados
        String selectedGenre = genreSpinner.getSelectedItem().toString();
        String selectedPlatform = platformSpinner.getSelectedItem().toString();

        // Converte "All" para null (sem filtro)
        String genreParam = "All".equals(selectedGenre) ? null : selectedGenre;
        String platformParam = "All".equals(selectedPlatform) ? null : selectedPlatform;

        new Thread(() -> {
            // Obtém os jogos filtrados
            List<Game> filteredGames = gameDao.getFilteredGames(genreParam, platformParam);

            // Atualiza a UI na thread principal
            requireActivity().runOnUiThread(() -> gameAdapter.updateGames(filteredGames));
        }).start();
    }
}