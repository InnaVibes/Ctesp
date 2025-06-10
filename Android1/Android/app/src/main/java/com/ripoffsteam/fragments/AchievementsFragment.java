package com.ripoffsteam.fragments;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.ripoffsteam.R;
import com.ripoffsteam.adapters.AchievementAdapter;
import com.ripoffsteam.utils.AchievementManager;
import java.util.List;

/**
 * Fragmento para exibir conquistas e estatísticas do jogador
 */
public class AchievementsFragment extends Fragment {

    private RecyclerView achievementsRecycler;
    private TextView statsGamesViewed, statsWishlistPeak, statsShakesUsed, statsAchievements;
    private AchievementManager achievementManager;
    private AchievementAdapter adapter;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_achievement, container, false);

        initializeViews(view);
        setupAchievementManager();
        setupRecyclerView();
        loadAchievements();
        updateStats();

        return view;
    }

    /**
     * Inicializa as views do layout
     */
    private void initializeViews(View view) {
        achievementsRecycler = view.findViewById(R.id.achievements_recycler);
        statsGamesViewed = view.findViewById(R.id.stats_games_viewed);
        statsWishlistPeak = view.findViewById(R.id.stats_wishlist_peak);
        statsShakesUsed = view.findViewById(R.id.stats_shakes_used);
        statsAchievements = view.findViewById(R.id.stats_achievements);
    }

    /**
     * Configura o gestor de conquistas
     */
    private void setupAchievementManager() {
        achievementManager = new AchievementManager(requireContext());
    }

    /**
     * Configura o RecyclerView
     */
    private void setupRecyclerView() {
        achievementsRecycler.setLayoutManager(new LinearLayoutManager(getContext()));
        adapter = new AchievementAdapter();
        achievementsRecycler.setAdapter(adapter);
    }

    /**
     * Carrega as conquistas
     */
    private void loadAchievements() {
        List<AchievementManager.Achievement> achievements = achievementManager.getAllAchievements();
        adapter.updateAchievements(achievements);
    }

    /**
     * Atualiza as estatísticas exibidas
     */
    private void updateStats() {
        AchievementManager.PlayerStats stats = achievementManager.getPlayerStats();

        statsGamesViewed.setText(String.valueOf(stats.gamesViewed));
        statsWishlistPeak.setText(String.valueOf(stats.wishlistPeak));
        statsShakesUsed.setText(String.valueOf(stats.shakesUsed));
        statsAchievements.setText(stats.achievementsUnlocked + "/" +
                achievementManager.getAllAchievements().size());
    }

    @Override
    public void onResume() {
        super.onResume();
        // Atualiza conquistas e estatísticas quando o fragmento fica visível
        loadAchievements();
        updateStats();
    }
}