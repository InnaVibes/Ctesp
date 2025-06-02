package com.ripoffsteam.notifications;

import android.content.Context;
import androidx.work.ExistingPeriodicWorkPolicy;
import androidx.work.PeriodicWorkRequest;
import androidx.work.WorkManager;

import java.util.concurrent.TimeUnit;

public class NotificationScheduler {

    private static final String DAILY_NOTIFICATION_WORK = "daily_game_notification";

    public static void scheduleDailyNotification(Context context) {
        PeriodicWorkRequest dailyWorkRequest =
                new PeriodicWorkRequest.Builder(com.ripoffsteam.notifications.DailyGameNotificationWorker.class,
                        24, TimeUnit.HOURS)
                        .build();

        WorkManager.getInstance(context).enqueueUniquePeriodicWork(
                DAILY_NOTIFICATION_WORK,
                ExistingPeriodicWorkPolicy.KEEP,
                dailyWorkRequest
        );
    }

    public static void cancelDailyNotification(Context context) {
        WorkManager.getInstance(context).cancelUniqueWork(DAILY_NOTIFICATION_WORK);
    }
}