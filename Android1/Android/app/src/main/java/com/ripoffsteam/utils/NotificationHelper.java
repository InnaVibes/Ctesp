package com.ripoffsteam.utils;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import androidx.core.app.NotificationCompat;
import com.ripoffsteam.MainActivity;
import com.ripoffsteam.R;

/**
 * Classe utilitária para gerenciar notificações imediatas
 */
public class NotificationHelper {

    private static final String CHANNEL_ID = "test_notification_channel";
    private static final String CHANNEL_NAME = "Notificações de Teste";
    private static final String CHANNEL_DESCRIPTION = "Canal para notificações de teste do RipoffSteam";
    private static final int NOTIFICATION_ID = 2001;

    private Context context;
    private NotificationManager notificationManager;

    public NotificationHelper(Context context) {
        this.context = context;
        this.notificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        createNotificationChannel();
    }

    /**
     * Cria o canal de notificação (necessário para Android O+)
     */
    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    CHANNEL_ID,
                    CHANNEL_NAME,
                    NotificationManager.IMPORTANCE_DEFAULT
            );
            channel.setDescription(CHANNEL_DESCRIPTION);
            channel.enableLights(true);
            channel.enableVibration(true);

            if (notificationManager != null) {
                notificationManager.createNotificationChannel(channel);
            }
        }
    }

    /**
     * Envia uma notificação de teste imediata
     */
    public void sendTestNotification() {
        try {
            // Intent para abrir a MainActivity quando a notificação for tocada
            Intent intent = new Intent(context, MainActivity.class);
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);

            PendingIntent pendingIntent = PendingIntent.getActivity(
                    context,
                    0,
                    intent,
                    PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
            );

            // Constrói a notificação
            NotificationCompat.Builder builder = new NotificationCompat.Builder(context, CHANNEL_ID)
                    .setSmallIcon(R.drawable.ic_game_controller)
                    .setContentTitle(context.getString(R.string.test_notification_title))
                    .setContentText(context.getString(R.string.test_notification_message))
                    .setStyle(new NotificationCompat.BigTextStyle()
                            .bigText(context.getString(R.string.test_notification_message) + "\n\nToque para explorar novos jogos!"))
                    .setPriority(NotificationCompat.PRIORITY_DEFAULT)
                    .setContentIntent(pendingIntent)
                    .setAutoCancel(true)
                    .setVibrate(new long[]{0, 250, 250, 250}) // Vibração personalizada
                    .setLights(0xFF673AB7, 1000, 1000); // Luz roxa (cor do app)

            // Envia a notificação
            if (notificationManager != null) {
                notificationManager.notify(NOTIFICATION_ID, builder.build());
            }

        } catch (Exception e) {
            android.util.Log.e("NotificationHelper", "Erro ao enviar notificação de teste: " + e.getMessage());
        }
    }

    /**
     * Envia uma notificação personalizada
     */
    public void sendCustomNotification(String title, String message) {
        try {
            Intent intent = new Intent(context, MainActivity.class);
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);

            PendingIntent pendingIntent = PendingIntent.getActivity(
                    context,
                    0,
                    intent,
                    PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
            );

            NotificationCompat.Builder builder = new NotificationCompat.Builder(context, CHANNEL_ID)
                    .setSmallIcon(R.drawable.ic_game_controller)
                    .setContentTitle(title)
                    .setContentText(message)
                    .setPriority(NotificationCompat.PRIORITY_DEFAULT)
                    .setContentIntent(pendingIntent)
                    .setAutoCancel(true);

            if (notificationManager != null) {
                notificationManager.notify(NOTIFICATION_ID + 1, builder.build());
            }

        } catch (Exception e) {
            android.util.Log.e("NotificationHelper", "Erro ao enviar notificação personalizada: " + e.getMessage());
        }
    }

    /**
     * Cancela todas as notificações
     */
    public void cancelAllNotifications() {
        if (notificationManager != null) {
            notificationManager.cancelAll();
        }
    }

    /**
     * Verifica se as notificações estão habilitadas
     */
    public boolean areNotificationsEnabled() {
        if (notificationManager != null) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                return notificationManager.areNotificationsEnabled();
            }
        }
        return true; // Assume true para versões antigas
    }
}