package com.ripoffsteam.utils;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.content.SharedPreferences;
import android.os.Build;
import androidx.core.app.NotificationCompat;
import androidx.preference.PreferenceManager;
import com.ripoffsteam.R;
import java.util.ArrayList;
import java.util.List;

/**
 * Gestor do sistema de conquistas/achievements
 */
public class AchievementManager {
    private static final String CHANNEL_ID = "achievement_channel";
    private static final String PREF_ACHIEVEMENT_PREFIX = "achievement_";
    private static final String PREF_GAMES_VIEWED = "games_viewed_count";
    private static final String PREF_WISHLIST_PEAK = "wishlist_peak_size";

    private Context context;
    private SharedPreferences prefs;

    public AchievementManager(Context context) {
        this.context = context;
        this.prefs = PreferenceManager.getDefaultSharedPreferences(context);
        createNotificationChannel();
    }

    /**
     * Define uma conquista disponível
     */
    public static class Achievement {
        public String id;
        public String title;
        public String description;
        public int iconResource;
        public boolean isUnlocked;

        public Achievement(String id, String title, String description, int iconResource) {
            this.id = id;
            this.title = title;
            this.description = description;
            this.iconResource = iconResource;
            this.isUnlocked = false;
        }
    }

    /**
     * Lista de todas as conquistas disponíveis
     */
    public List<Achievement> getAllAchievements() {
        List<Achievement> achievements = new ArrayList<>();

        // Conquistas da Wishlist
        achievements.add(new Achievement(
                "first_wishlist",
                "Primeiro Desejo",
                "Adicione o primeiro jogo à sua wishlist",
                R.drawable.ic_favorite
        ));

        achievements.add(new Achievement(
                "collector_bronze",
                "Colecionador Bronze",
                "Tenha 5 jogos na sua wishlist",
                R.drawable.ic_favorite
        ));

        achievements.add(new Achievement(
                "collector_silver",
                "Colecionador Prata",
                "Tenha 10 jogos na sua wishlist",
                R.drawable.ic_favorite
        ));

        achievements.add(new Achievement(
                "collector_gold",
                "Colecionador Ouro",
                "Tenha 20 jogos na sua wishlist",
                R.drawable.ic_favorite
        ));

        // Conquistas de Exploração
        achievements.add(new Achievement(
                "explorer_bronze",
                "Explorador Bronze",
                "Visualize detalhes de 10 jogos diferentes",
                R.drawable.ic_browse
        ));

        achievements.add(new Achievement(
                "explorer_silver",
                "Explorador Prata",
                "Visualize detalhes de 25 jogos diferentes",
                R.drawable.ic_browse
        ));

        achievements.add(new Achievement(
                "explorer_gold",
                "Explorador Ouro",
                "Visualize detalhes de 50 jogos diferentes",
                R.drawable.ic_browse
        ));

        // Conquistas Especiais
        achievements.add(new Achievement(
                "shake_master",
                "Mestre do Shake",
                "Use a funcionalidade de shake 10 vezes",
                R.drawable.ic_game_controller
        ));

        achievements.add(new Achievement(
                "social_sharer",
                "Partilhador Social",
                "Partilhe 5 jogos diferentes",
                R.drawable.ic_share
        ));

        achievements.add(new Achievement(
                "early_bird",
                "Madrugador",
                "Abra a app antes das 7h da manhã",
                R.drawable.ic_home
        ));

        // Marca quais estão desbloqueadas
        for (Achievement achievement : achievements) {
            achievement.isUnlocked = isAchievementUnlocked(achievement.id);
        }

        return achievements;
    }

    /**
     * Verifica se uma conquista está desbloqueada
     */
    public boolean isAchievementUnlocked(String achievementId) {
        return prefs.getBoolean(PREF_ACHIEVEMENT_PREFIX + achievementId, false);
    }

    /**
     * Desbloqueia uma conquista
     */
    private void unlockAchievement(String achievementId, String title, String description) {
        if (!isAchievementUnlocked(achievementId)) {
            prefs.edit()
                    .putBoolean(PREF_ACHIEVEMENT_PREFIX + achievementId, true)
                    .apply();

            showAchievementNotification(title, description);
        }
    }

    /**
     * Verifica conquistas relacionadas à wishlist
     */
    public void checkWishlistAchievements(int currentWishlistSize) {
        // Atualiza o pico da wishlist
        int previousPeak = prefs.getInt(PREF_WISHLIST_PEAK, 0);
        if (currentWishlistSize > previousPeak) {
            prefs.edit().putInt(PREF_WISHLIST_PEAK, currentWishlistSize).apply();
        }

        // Verifica conquistas
        if (currentWishlistSize >= 1) {
            unlockAchievement("first_wishlist", "Primeiro Desejo",
                    "Parabéns! Adicionou o primeiro jogo à wishlist!");
        }
        if (currentWishlistSize >= 5) {
            unlockAchievement("collector_bronze", "Colecionador Bronze",
                    "Tem 5 jogos na sua wishlist!");
        }
        if (currentWishlistSize >= 10) {
            unlockAchievement("collector_silver", "Colecionador Prata",
                    "Tem 10 jogos na sua wishlist!");
        }
        if (currentWishlistSize >= 20) {
            unlockAchievement("collector_gold", "Colecionador Ouro",
                    "Incrível! Tem 20 jogos na sua wishlist!");
        }
    }

    /**
     * Registra visualização de um jogo
     */
    public void recordGameView(String gameId) {
        // Mantém lista de jogos visualizados
        String viewedGamesKey = "viewed_games_list";
        String viewedGames = prefs.getString(viewedGamesKey, "");

        if (!viewedGames.contains(gameId)) {
            String updatedList = viewedGames.isEmpty() ? gameId : viewedGames + "," + gameId;
            prefs.edit().putString(viewedGamesKey, updatedList).apply();

            // Conta total de jogos visualizados
            int viewCount = updatedList.split(",").length;
            prefs.edit().putInt(PREF_GAMES_VIEWED, viewCount).apply();

            checkExplorationAchievements(viewCount);
        }
    }

    /**
     * Verifica conquistas de exploração
     */
    private void checkExplorationAchievements(int gamesViewed) {
        if (gamesViewed >= 10) {
            unlockAchievement("explorer_bronze", "Explorador Bronze",
                    "Visualizou 10 jogos diferentes!");
        }
        if (gamesViewed >= 25) {
            unlockAchievement("explorer_silver", "Explorador Prata",
                    "Visualizou 25 jogos diferentes!");
        }
        if (gamesViewed >= 50) {
            unlockAchievement("explorer_gold", "Explorador Ouro",
                    "Explorador master! 50 jogos visualizados!");
        }
    }

    /**
     * Registra uso da funcionalidade shake
     */
    public void recordShakeUsage() {
        int shakeCount = prefs.getInt("shake_usage_count", 0) + 1;
        prefs.edit().putInt("shake_usage_count", shakeCount).apply();

        if (shakeCount >= 10) {
            unlockAchievement("shake_master", "Mestre do Shake",
                    "Usou a funcionalidade shake 10 vezes!");
        }
    }

    /**
     * Registra partilha de jogo
     */
    public void recordGameShare(String gameId) {
        String sharedGamesKey = "shared_games_list";
        String sharedGames = prefs.getString(sharedGamesKey, "");

        if (!sharedGames.contains(gameId)) {
            String updatedList = sharedGames.isEmpty() ? gameId : sharedGames + "," + gameId;
            prefs.edit().putString(sharedGamesKey, updatedList).apply();

            int shareCount = updatedList.split(",").length;
            if (shareCount >= 5) {
                unlockAchievement("social_sharer", "Partilhador Social",
                        "Partilhou 5 jogos diferentes!");
            }
        }
    }

    /**
     * Verifica conquista de madrugador
     */
    public void checkEarlyBirdAchievement() {
        java.util.Calendar cal = java.util.Calendar.getInstance();
        int hour = cal.get(java.util.Calendar.HOUR_OF_DAY);

        if (hour < 7) {
            unlockAchievement("early_bird", "Madrugador",
                    "Abriu a app antes das 7h da manhã!");
        }
    }

    /**
     * Obtém estatísticas do jogador
     */
    public PlayerStats getPlayerStats() {
        return new PlayerStats(
                prefs.getInt(PREF_GAMES_VIEWED, 0),
                prefs.getInt(PREF_WISHLIST_PEAK, 0),
                prefs.getInt("shake_usage_count", 0),
                getUnlockedAchievementsCount()
        );
    }

    /**
     * Classe para estatísticas do jogador
     */
    public static class PlayerStats {
        public int gamesViewed;
        public int wishlistPeak;
        public int shakesUsed;
        public int achievementsUnlocked;

        public PlayerStats(int gamesViewed, int wishlistPeak, int shakesUsed, int achievementsUnlocked) {
            this.gamesViewed = gamesViewed;
            this.wishlistPeak = wishlistPeak;
            this.shakesUsed = shakesUsed;
            this.achievementsUnlocked = achievementsUnlocked;
        }
    }

    /**
     * Conta conquistas desbloqueadas
     */
    private int getUnlockedAchievementsCount() {
        int count = 0;
        for (Achievement achievement : getAllAchievements()) {
            if (isAchievementUnlocked(achievement.id)) {
                count++;
            }
        }
        return count;
    }

    /**
     * Mostra notificação de conquista desbloqueada
     */
    private void showAchievementNotification(String title, String description) {
        NotificationCompat.Builder builder = new NotificationCompat.Builder(context, CHANNEL_ID)
                .setSmallIcon(R.drawable.ic_game_controller)
                .setContentTitle("🏆 Conquista Desbloqueada!")
                .setContentText(title)
                .setStyle(new NotificationCompat.BigTextStyle()
                        .bigText(title + "\n" + description))
                .setPriority(NotificationCompat.PRIORITY_DEFAULT)
                .setAutoCancel(true);

        NotificationManager notificationManager =
                (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);

        if (notificationManager != null) {
            notificationManager.notify((int) System.currentTimeMillis(), builder.build());
        }
    }

    /**
     * Cria canal de notificação para conquistas
     */
    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            CharSequence name = "Achievement Channel";
            String description = "Notifications for unlocked achievements";
            int importance = NotificationManager.IMPORTANCE_DEFAULT;

            NotificationChannel channel = new NotificationChannel(CHANNEL_ID, name, importance);
            channel.setDescription(description);

            NotificationManager notificationManager =
                    (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);

            if (notificationManager != null) {
                notificationManager.createNotificationChannel(channel);
            }
        }
    }
}