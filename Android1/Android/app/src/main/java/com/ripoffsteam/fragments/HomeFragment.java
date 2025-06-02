package com.ripoffsteam.fragments;

import android.content.Context;
import android.content.Intent;
import android.hardware.Sensor;
import android.hardware.SensorManager;
import android.os.Bundle;
import android.widget.TextView;
import android.widget.Toast;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.ripoffsteam.DA0.GameDao;
import com.ripoffsteam.DataBase.AppDatabase;
import com.ripoffsteam.GameDetailActivity;
import com.ripoffsteam.R;
import com.ripoffsteam.adapters.NewReleasesAdapter;
import com.ripoffsteam.modelos.Game;
import com.ripoffsteam.utils.ShakeDetector;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.Executors;

public class HomeFragment extends Fragment implements ShakeDetector.OnShakeListener {

    // Existing fields
    private List<Game> recommendedGames = new ArrayList<>();
    private List<Game> newReleasesGames = new ArrayList<>();
    private List<Game> popularGames = new ArrayList<>();
    private NewReleasesAdapter recommendedAdapter;
    private NewReleasesAdapter newReleasesAdapter;
    private NewReleasesAdapter popularAdapter;

    // Sensor fields
    private SensorManager mSensorManager;
    private Sensor mAccelerometer;
    private ShakeDetector mShakeDetector;
    private List<Game> allGames = new ArrayList<>();

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_home, container, false);

        setupViews(view);
        setupSensors();
        loadGames();

        return view;
    }

    private void setupViews(View view) {
        TextView greetingText = view.findViewById(R.id.greeting_text);
        RecyclerView recommendedRecycler = view.findViewById(R.id.recommended_recycler);
        RecyclerView newReleasesRecycler = view.findViewById(R.id.new_releases_recycler);
        RecyclerView popularRecycler = view.findViewById(R.id.popular_recycler);

        greetingText.setText("Welcome to RipoffSteam!");

        // Initialize adapters
        recommendedAdapter = new NewReleasesAdapter(recommendedGames);
        newReleasesAdapter = new NewReleasesAdapter(newReleasesGames);
        popularAdapter = new NewReleasesAdapter(popularGames);

        // Setup RecyclerViews
        setupRecyclerView(recommendedRecycler, recommendedAdapter);
        setupRecyclerView(newReleasesRecycler, newReleasesAdapter);
        setupRecyclerView(popularRecycler, popularAdapter);
    }

    private void setupRecyclerView(RecyclerView recyclerView, NewReleasesAdapter adapter) {
        recyclerView.setAdapter(adapter);
        recyclerView.setLayoutManager(new LinearLayoutManager(
                getContext(), LinearLayoutManager.HORIZONTAL, false));
        adapter.setOnGameClickListener(this::openGameDetail);
    }

    private void setupSensors() {
        // Initialize sensor manager e detector
        mSensorManager = (SensorManager) requireActivity().getSystemService(Context.SENSOR_SERVICE);
        mAccelerometer = mSensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);
        mShakeDetector = new ShakeDetector();
        mShakeDetector.setOnShakeListener(this);
    }

    private void loadGames() {
        AppDatabase db = AppDatabase.getInstance(requireContext());
        GameDao gameDao = db.gameDao();

        Executors.newSingleThreadExecutor().execute(() -> {
            List<Game> games = gameDao.getAll();
            allGames.clear();
            allGames.addAll(games);

            requireActivity().runOnUiThread(() -> {
                recommendedGames.clear();
                newReleasesGames.clear();
                popularGames.clear();

                // Distribute games across sections
                for (int i = 0; i < games.size(); i++) {
                    if (i % 3 == 0) recommendedGames.add(games.get(i));
                    else if (i % 3 == 1) newReleasesGames.add(games.get(i));
                    else popularGames.add(games.get(i));
                }

                recommendedAdapter.notifyDataSetChanged();
                newReleasesAdapter.notifyDataSetChanged();
                popularAdapter.notifyDataSetChanged();
            });
        });
    }

    @Override
    public void onShake(int count) {
        // Triggered when shake is detected
        if (!allGames.isEmpty()) {
            Random random = new Random();
            Game randomGame = allGames.get(random.nextInt(allGames.size()));

            Toast.makeText(getContext(),
                    "Surprise! Random game: " + randomGame.getName(),
                    Toast.LENGTH_LONG).show();

            // Optionally open the game detail
            openGameDetail(randomGame);
        }
    }

    @Override
    public void onResume() {
        super.onResume();
        // Register sensor listener
        if (mSensorManager != null && mAccelerometer != null) {
            mSensorManager.registerListener(mShakeDetector, mAccelerometer,
                    SensorManager.SENSOR_DELAY_UI);
        }
    }

    @Override
    public void onPause() {
        super.onPause();
        // Unregister sensor listener to save battery
        if (mSensorManager != null) {
            mSensorManager.unregisterListener(mShakeDetector);
        }
    }

    private void openGameDetail(Game game) {
        if (getActivity() == null) return;

        Intent intent = new Intent(getActivity(), GameDetailActivity.class);
        intent.putExtra("GAME_ID", game.getId());
        startActivity(intent);
    }
}