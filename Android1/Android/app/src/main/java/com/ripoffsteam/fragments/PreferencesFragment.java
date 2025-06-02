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
import java.util.Set;

public class PreferencesFragment extends PreferenceFragmentCompat
        implements SharedPreferences.OnSharedPreferenceChangeListener {

    @Override
    public void onCreatePreferences(Bundle savedInstanceState, String rootKey) {
        // Carrega as preferências a partir do XML
        setPreferencesFromResource(R.xml.preferences, rootKey);
        initSummaries();

        // Aplica o tema salvo nas preferências
        applyTheme();
    }

    private void initSummaries() {
        SharedPreferences prefs = getPreferenceScreen().getSharedPreferences();
        for (String key : prefs.getAll().keySet()) {
            updateSummary(key);
        }
    }

    private void updateSummary(String key) {
        Preference preference = findPreference(key);
        if (preference == null) return;
        SharedPreferences prefs = getPreferenceScreen().getSharedPreferences();

        if (preference instanceof EditTextPreference) {
            String value = prefs.getString(key, "");
            preference.setSummary(value.isEmpty() ? "Não definido" : value);
        }
        else if (preference instanceof SwitchPreferenceCompat) {
            boolean value = prefs.getBoolean(key, false);
            ((SwitchPreferenceCompat) preference).setChecked(value);
            preference.setSummary(value ? "Ativado" : "Desativado");
        }
        else if (preference instanceof ListPreference) {
            ListPreference listPref = (ListPreference) preference;
            CharSequence entry = listPref.getEntry();
            listPref.setSummary(entry != null ? entry : "Não selecionado");
        }
        else if (preference instanceof MultiSelectListPreference) {
            MultiSelectListPreference multiPref = (MultiSelectListPreference) preference;
            Set<String> values = prefs.getStringSet(key, null);
            if (values != null && !values.isEmpty()) {
                preference.setSummary("Selecionados: " + values.size());
            } else {
                preference.setSummary("Nenhum selecionado");
            }
        }
        else if (preference instanceof SeekBarPreference) {
            int value = prefs.getInt(key, 20);
            preference.setSummary(String.valueOf(value));
        }
        else if (preference instanceof CheckBoxPreference) {
            boolean value = prefs.getBoolean(key, false);
            ((CheckBoxPreference) preference).setChecked(value);
            preference.setSummary(value ? "Ativado" : "Desativado");
        }
    }

    @Override
    public void onSharedPreferenceChanged(SharedPreferences sharedPreferences, String key) {
        updateSummary(key);

        // Aplica mudanças específicas
        if (key.equals(getString(R.string.pref_set_username_key))) {
            String username = sharedPreferences.getString(key, "");
            Toast.makeText(getContext(), "Username atualizado: " + username, Toast.LENGTH_SHORT).show();
        }
        else if (key.equals(getString(R.string.pref_theme_key))) {
            // APLICAR MUDANÇA DE TEMA IMEDIATAMENTE
            applyThemeChange(sharedPreferences.getString(key, "system"));
        }
        else if (key.equals(getString(R.string.pref_notification_key))) {
            boolean enabled = sharedPreferences.getBoolean(key, true);
            if (enabled) {
                // Reagenda notificações se foram ativadas
                com.ripoffsteam.notifications.NotificationScheduler.scheduleDailyNotification(requireContext());
            } else {
                // Cancela notificações se foram desativadas
                com.ripoffsteam.notifications.NotificationScheduler.cancelDailyNotification(requireContext());
            }
            Toast.makeText(getContext(),
                    enabled ? "Notificações ativadas" : "Notificações desativadas",
                    Toast.LENGTH_SHORT).show();
        }
        else if (key.equals(getString(R.string.pref_language_key))) {
            String language = sharedPreferences.getString(key, "en");
            Toast.makeText(getContext(), "Idioma alterado para: " + language, Toast.LENGTH_SHORT).show();
            // Nota: Para aplicar completamente o idioma, a app precisa ser reiniciada
        }
    }

    /**
     * Aplica o tema salvo nas preferências
     */
    private void applyTheme() {
        SharedPreferences prefs = getPreferenceScreen().getSharedPreferences();
        String theme = prefs.getString(getString(R.string.pref_theme_key), "system");
        applyThemeChange(theme);
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

        Toast.makeText(getContext(), "Tema alterado", Toast.LENGTH_SHORT).show();

        // Reinicia a activity para aplicar o tema
        if (getActivity() != null) {
            getActivity().recreate();
        }
    }
}