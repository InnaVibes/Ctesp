package com.ripoffsteam.utils;

import android.content.Context;
import android.content.SharedPreferences;
import androidx.appcompat.app.AppCompatDelegate;
import androidx.preference.PreferenceManager;
import com.ripoffsteam.R;

/**
 * Classe utilitária para gerir temas da aplicação
 */
public class ThemeManager {

    public static final String THEME_LIGHT = "light";
    public static final String THEME_DARK = "dark";
    public static final String THEME_SYSTEM = "system";

    /**
     * Aplica o tema baseado nas preferências salvas
     */
    public static void applyTheme(Context context) {
        SharedPreferences prefs = PreferenceManager.getDefaultSharedPreferences(context);
        String theme = prefs.getString(context.getString(R.string.pref_theme_key), THEME_SYSTEM);
        applyTheme(theme);
    }

    /**
     * Aplica um tema específico
     */
    public static void applyTheme(String theme) {
        switch (theme) {
            case THEME_LIGHT:
                AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO);
                break;
            case THEME_DARK:
                AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_YES);
                break;
            case THEME_SYSTEM:
            default:
                AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_FOLLOW_SYSTEM);
                break;
        }
    }

    /**
     * Obtém o tema atual das preferências
     */
    public static String getCurrentTheme(Context context) {
        SharedPreferences prefs = PreferenceManager.getDefaultSharedPreferences(context);
        return prefs.getString(context.getString(R.string.pref_theme_key), THEME_SYSTEM);
    }

    /**
     * Define um novo tema nas preferências
     */
    public static void setTheme(Context context, String theme) {
        SharedPreferences prefs = PreferenceManager.getDefaultSharedPreferences(context);
        prefs.edit()
                .putString(context.getString(R.string.pref_theme_key), theme)
                .apply();
        applyTheme(theme);
    }

    /**
     * Verifica se está em modo escuro atualmente
     */
    public static boolean isDarkMode() {
        return AppCompatDelegate.getDefaultNightMode() == AppCompatDelegate.MODE_NIGHT_YES;
    }
}