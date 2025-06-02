package com.ripoffsteam.notifications;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import androidx.core.app.NotificationCompat;
import androidx.work.Worker;
import androidx.work.WorkerParameters;

import com.ripoffsteam.DataBase.AppDatabase;
import com.ripoffsteam.GameDetailActivity;
import com.ripoffsteam.R;
import com.ripoffsteam.modelos.Game;

import java.util.List;
import java.util.Random;

public class DailyGameNotificationWorker extends Worker {

    private static final String CHANNEL_ID = "daily_game_channel";
    private static final int NOTIFICATION_ID = 1001;

    public DailyGameNotificationWorker(Context context, WorkerParameters params) {
        super(context, params);
    }

    @Override
    public Result doWork() {
        try {
            // Get random game from database
            AppDatabase db = AppDatabase.getInstance(getApplicationContext());
            List<Game> games = db.gameDao().getAll();

            if (!games.isEmpty()) {
                Random random = new Random();
                Game randomGame = games.get(random.nextInt(games.size()));

                showNotification(randomGame);
            }

            return Result.success();
        } catch (Exception e) {
            return Result.failure();
        }
    }

    private void showNotification(Game game) {
        createNotificationChannel();

        Intent intent = new Intent(getApplicationContext(), GameDetailActivity.class);
        intent.putExtra("GAME_ID", game.getId());
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);

        PendingIntent pendingIntent = PendingIntent.getActivity(
                getApplicationContext(), 0, intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);

        NotificationCompat.Builder builder = new NotificationCompat.Builder(
                getApplicationContext(), CHANNEL_ID)
                .setSmallIcon(R.drawable.ic_game_controller)
                .setContentTitle("Daily Game Discovery")
                .setContentText("Check out: " + game.getName())
                .setStyle(new NotificationCompat.BigTextStyle()
                        .bigText(game.getDescription()))
                .setPriority(NotificationCompat.PRIORITY_DEFAULT)
                .setContentIntent(pendingIntent)
                .setAutoCancel(true);

        NotificationManager notificationManager =
                (NotificationManager) getApplicationContext().getSystemService(Context.NOTIFICATION_SERVICE);

        if (notificationManager != null) {
            notificationManager.notify(NOTIFICATION_ID, builder.build());
        }
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            CharSequence name = "Daily Game Channel";
            String description = "Daily game recommendations";
            int importance = NotificationManager.IMPORTANCE_DEFAULT;

            NotificationChannel channel = new NotificationChannel(CHANNEL_ID, name, importance);
            channel.setDescription(description);

            NotificationManager notificationManager =
                    (NotificationManager) getApplicationContext().getSystemService(Context.NOTIFICATION_SERVICE);

            if (notificationManager != null) {
                notificationManager.createNotificationChannel(channel);
            }
        }
    }
}