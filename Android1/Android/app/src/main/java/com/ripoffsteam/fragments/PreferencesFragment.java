package com.ripoffsteam.fragments;

import android.content.SharedPreferences;
import android.os.Bundle;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatDelegate;
import androidx.preference.CheckBoxPreference;
import androidx.preference.EditTextPreference;
import androidx.preference.ListPreference;
import androidx.preference.MultiSelectListPreference;
import androidx.preference.Preference;
import androidx.preference.PreferenceFragmentCompat;
import androidx.preference.SeekBarPreference;
import androidx.preference.SwitchPreferenceCompat;
import com.ripoffsteam.R;
import com.ripoffsteam.notifications.NotificationScheduler;
import java.util.Set;

/**
 * Fragment para gerenciar as preferências da aplicação
 */
public class PreferencesFragment extends PreferenceFragmentCompat
        implements SharedPreferences.OnSharedPreferenceChangeListener {

    private SharedPreferences sharedPreferences;

    @Override
    public void onCreatePreferences(Bundle savedInstanceState, String rootKey) {
        // Carrega as preferências a partir do XML
        setPreferencesFromResource(R.xml.preferences, rootKey);

        // Obtém referência às SharedPreferences
        sharedPreferences = getPreferenceScreen().getSharedPreferences();

        // Inicializa os summaries
        initSummaries();
    }

    /**
     * Inicializa os summaries de todas as preferências
     */
    private void initSummaries() {
        if (sharedPreferences == null) return;

        for (String key : sharedPreferences.getAll().keySet()) {
            updateSummary(key);
        }
    }

    /**
     * Atualiza o summary de uma preferência específica
     */
    private void updateSummary(String key) {
        Preference preference = findPreference(key);
        if (preference == null || sharedPreferences == null) return;

        if (preference instanceof EditTextPreference) {
            String value = sharedPreferences.getString(key, "");
            preference.setSummary(value.isEmpty() ?
                    getString(R.string.not_set) : value);
        }
        else if (preference instanceof SwitchPreferenceCompat) {
            boolean value = sharedPreferences.getBoolean(key, false);
            preference.setSummary(value ?
                    getString(R.string.enabled) : getString(R.string.disabled));
        }
        else if (preference instanceof CheckBoxPreference) {
            boolean value = sharedPreferences.getBoolean(key, false);
            preference.setSummary(value ?
                    getString(R.string.enabled) : getString(R.string.disabled));
        }
        else if (preference instanceof ListPreference) {
            ListPreference listPref = (ListPreference) preference;
            CharSequence entry = listPref.getEntry();
            listPref.setSummary(entry != null ? entry : getString(R.string.none_selected));
        }
        else if (preference instanceof MultiSelectListPreference) {
            Set<String> values = sharedPreferences.getStringSet(key, null);
            if (values != null && !values.isEmpty()) {
                preference.setSummary("Selected: " + values.size());
            } else {
                preference.setSummary(getString(R.string.none_selected));
            }
        }
        else if (preference instanceof SeekBarPreference) {
            int value = sharedPreferences.getInt(key, 20);
            preference.setSummary(String.valueOf(value));
        }
    }

    @Override
    public void onSharedPreferenceChanged(SharedPreferences sharedPreferences, String key) {
        // Atualiza o summary
        updateSummary(key);

        // Aplica mudanças específicas
        handlePreferenceChange(key, sharedPreferences);
    }

    /**
     * Lida com mudanças específicas de preferências
     */
    private void handlePreferenceChange(String key, SharedPreferences prefs) {
        if (key.equals(getString(R.string.pref_set_username_key))) {
            String username = prefs.getString(key, "");
            showToast(getString(R.string.username_updated, username));
        }
        else if (key.equals(getString(R.string.pref_theme_key))) {
            String theme = prefs.getString(key, "system");
            applyThemeChange(theme);
        }
        else if (key.equals(getString(R.string.pref_notification_key))) {
            boolean enabled = prefs.getBoolean(key, true);
            handleNotificationToggle(enabled);
        }
        else if (key.equals(getString(R.string.pref_language_key))) {
            String language = prefs.getString(key, "en");
            showToast(getString(R.string.language_changed, language));
            showToast(getString(R.string.restart_required));
        }
        else if (key.equals(getString(R.string.pref_notification_time_key))) {
            String time = prefs.getString(key, "09:00");
            // Reagenda notificações com novo horário
            if (prefs.getBoolean(getString(R.string.pref_notification_key), true)) {
                NotificationScheduler.scheduleDailyNotification(requireContext());
            }
        }
    }

    /**
     * Aplica mudança de tema imediatamente
     */
    private void applyThemeChange(String themeValue) {
        switch (themeValue) {
            case "light":
                AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO);
                break;
            case "dark":
                AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_YES);
                break;
            case "system":
            default:
                AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_FOLLOW_SYSTEM);
                break;
        }

        showToast(getString(R.string.theme_changed));

        // Reinicia a activity para aplicar o tema completamente
        if (getActivity() != null) {
            getActivity().recreate();
        }
    }

    /**
     * Lida com toggle de notificações
     */
    private void handleNotificationToggle(boolean enabled) {
        try {
            if (enabled) {
                NotificationScheduler.scheduleDailyNotification(requireContext());
                showToast(getString(R.string.notifications_enabled));
            } else {
                NotificationScheduler.cancelDailyNotification(requireContext());
                showToast(getString(R.string.notifications_disabled));
            }
        } catch (Exception e) {
            e.printStackTrace();
            showToast("Error updating notifications");
        }
    }

    /**
     * Mostra uma toast message
     */
    private void showToast(String message) {
        if (getContext() != null) {
            Toast.makeText(getContext(), message, Toast.LENGTH_SHORT).show();
        }
    }

    @Override
    public void onResume() {
        super.onResume();
        // CRÍTICO: Registra o listener para mudanças
        if (sharedPreferences != null) {
            sharedPreferences.registerOnSharedPreferenceChangeListener(this);
        }
    }

    @Override
    public void onPause() {
        super.onPause();
        // CRÍTICO: Remove o listener para evitar vazamentos
        if (sharedPreferences != null) {
            sharedPreferences.unregisterOnSharedPreferenceChangeListener(this);
        }
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        // Garante que o listener seja removido
        if (sharedPreferences != null) {
            sharedPreferences.unregisterOnSharedPreferenceChangeListener(this);
        }
    }
}