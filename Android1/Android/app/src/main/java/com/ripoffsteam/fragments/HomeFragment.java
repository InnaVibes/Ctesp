package com.ripoffsteam.fragments;

import android.content.Intent;
import android.os.Bundle;
import androidx.fragment.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.ripoffsteam.DA0.GameDao;
import com.ripoffsteam.DataBase.AppDatabase;
import com.ripoffsteam.GameDetailActivity;
import com.ripoffsteam.R;
import com.ripoffsteam.adapters.NewReleasesAdapter;
import com.ripoffsteam.modelos.Game;
import java.util.ArrayList;
import java.util.List;


 // Fragmento principal que mostra as secções de jogos recomendados, novos lançamentos e jogos populares

public class HomeFragment extends Fragment {
    private List<Game> recommendedGames = new ArrayList<>();
    private List<Game> newReleasesGames = new ArrayList<>();
    private List<Game> popularGames = new ArrayList<>();

    // Adaptadores para cada RecyclerView
    private NewReleasesAdapter recommendedAdapter;
    private NewReleasesAdapter newReleasesAdapter;
    private NewReleasesAdapter popularAdapter;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_home, container, false);

        // Inicia as views
        TextView greetingText = view.findViewById(R.id.greeting_text);
        RecyclerView recommendedRecycler = view.findViewById(R.id.recommended_recycler);
        RecyclerView newReleasesRecycler = view.findViewById(R.id.new_releases_recycler);
        RecyclerView popularRecycler = view.findViewById(R.id.popular_recycler);

        // Define a mensagem de boas-vindas
        greetingText.setText("Welcome to NotSteam!");

        // Inicializa os adaptadores com listas vazias
        recommendedAdapter = new NewReleasesAdapter(recommendedGames);
        newReleasesAdapter = new NewReleasesAdapter(newReleasesGames);
        popularAdapter = new NewReleasesAdapter(popularGames);

        // Configura a RecyclerView de jogos recomendados
        recommendedRecycler.setAdapter(recommendedAdapter);
        recommendedRecycler.setLayoutManager(new LinearLayoutManager(
                getContext(), LinearLayoutManager.HORIZONTAL, false));
        recommendedAdapter.setOnGameClickListener(this::openGameDetail);

        // Configura a RecyclerView de novos lançamentos
        newReleasesRecycler.setAdapter(newReleasesAdapter);
        newReleasesRecycler.setLayoutManager(new LinearLayoutManager(
                getContext(), LinearLayoutManager.HORIZONTAL, false));
        newReleasesAdapter.setOnGameClickListener(this::openGameDetail);

        // Configura a RecyclerView de jogos populares
        popularRecycler.setAdapter(popularAdapter);
        popularRecycler.setLayoutManager(new LinearLayoutManager(
                getContext(), LinearLayoutManager.HORIZONTAL, false));
        popularAdapter.setOnGameClickListener(this::openGameDetail);

        // Carrega os jogos da base de dados
        loadGames();

        return view;
    }

    private void loadGames() {
        AppDatabase db = AppDatabase.getInstance(requireContext());
        GameDao gameDao = db.gameDao();

        new Thread(() -> {
            // Obtém todos os jogos da base de dados
            List<Game> games = gameDao.getAll();

            // Atualiza a UI na thread principal
            requireActivity().runOnUiThread(() -> {
                // Limpa as listas atuais
                recommendedGames.clear();
                newReleasesGames.clear();
                popularGames.clear();

                // Adiciona os jogos às listas
                // Usamos os mesmos jogos para todas as secções para simplificar
                recommendedGames.addAll(games);
                newReleasesGames.addAll(games);
                popularGames.addAll(games);

                // Notifica os adaptadores sobre as mudanças
                recommendedAdapter.notifyDataSetChanged();
                newReleasesAdapter.notifyDataSetChanged();
                popularAdapter.notifyDataSetChanged();
            });
        }).start();
    }


     //Abre a atividade de detalhe do jogo selecionado


    private void openGameDetail(Game game) {
        if (getActivity() == null) return;

        Intent intent = new Intent(getActivity(), GameDetailActivity.class);
        intent.putExtra("GAME_ID", game.getId());
        startActivity(intent);
    }
}