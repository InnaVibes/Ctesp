package com.ripoffsteam.utils;

import android.content.Context;
import android.content.SharedPreferences;
import androidx.preference.PreferenceManager;
import com.ripoffsteam.R;

/**
 * Gestor de cache para controlar a validade dos dados armazenados
 */
public class CacheManager {
    private static final String CACHE_TIMESTAMP_KEY = "cache_timestamp";
    private static final String GAMES_CACHE_KEY = "games_cache_timestamp";

    private SharedPreferences prefs;
    private Context context;

    public CacheManager(Context context) {
        this.context = context;
        this.prefs = PreferenceManager.getDefaultSharedPreferences(context);
    }

    /**
     * Verifica se o cache dos jogos ainda é válido
     */
    public boolean isGamesCacheValid() {
        return isCacheValid(GAMES_CACHE_KEY);
    }

    /**
     * Marca o cache dos jogos como atualizado
     */
    public void markGamesCacheUpdated() {
        markCacheUpdated(GAMES_CACHE_KEY);
    }

    /**
     * Verifica se um cache específico é válido
     */
    private boolean isCacheValid(String cacheKey) {
        long cacheTime = prefs.getLong(cacheKey, 0);
        if (cacheTime == 0) {
            return false; // Nunca foi cached
        }

        // Obtém a duração do cache das configurações (em horas)
        String cacheHoursStr = prefs.getString(
                context.getString(R.string.pref_cache_duration_key), "24");
        int cacheValidityHours = Integer.parseInt(cacheHoursStr);

        long currentTime = System.currentTimeMillis();
        long cacheValidityMs = cacheValidityHours * 60 * 60 * 1000L;

        return (currentTime - cacheTime) < cacheValidityMs;
    }

    /**
     * Marca um cache como atualizado
     */
    private void markCacheUpdated(String cacheKey) {
        prefs.edit()
                .putLong(cacheKey, System.currentTimeMillis())
                .apply();
    }

    /**
     * Limpa todos os caches
     */
    public void clearAllCaches() {
        prefs.edit()
                .remove(CACHE_TIMESTAMP_KEY)
                .remove(GAMES_CACHE_KEY)
                .apply();
    }

    /**
     * Obtém a duração do cache em horas
     */
    public int getCacheDurationHours() {
        String cacheHoursStr = prefs.getString(
                context.getString(R.string.pref_cache_duration_key), "24");
        return Integer.parseInt(cacheHoursStr);
    }

    /**
     * Verifica se precisa atualizar dados da API
     */
    public boolean shouldRefreshFromApi() {
        return !isGamesCacheValid();
    }
}