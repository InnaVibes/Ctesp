package com.ripoffsteam.fragments;

import android.content.SharedPreferences;
import android.os.Bundle;
import android.widget.Toast;
import com.ripoffsteam.R;
import java.util.Set;
import androidx.preference.CheckBoxPreference;
import androidx.preference.EditTextPreference;
import androidx.preference.ListPreference;
import androidx.preference.MultiSelectListPreference;
import androidx.preference.Preference;
import androidx.preference.PreferenceFragmentCompat;
import androidx.preference.SeekBarPreference;
import androidx.preference.SwitchPreferenceCompat;


public class PreferencesFragment extends PreferenceFragmentCompat
        implements SharedPreferences.OnSharedPreferenceChangeListener {

    @Override
    public void onCreatePreferences(Bundle savedInstanceState, String rootKey) {
        // Carrega as preferências a partir do XML
        setPreferencesFromResource(R.xml.preferences, rootKey);
        initSummaries();
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
            listPref.setSummary(listPref.getEntry());
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
            int value = prefs.getInt(key, 50);
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
        if (key.equals(getString(R.string.pref_set_username_key))) {
            String username = sharedPreferences.getString(key, "");
            Toast.makeText(getContext(), "Username atualizado: " + username, Toast.LENGTH_SHORT).show();
        }
    }

    @Override
    public void onResume() {
        super.onResume();
        getPreferenceScreen().getSharedPreferences()
                .registerOnSharedPreferenceChangeListener(this);
    }

    @Override
    public void onPause() {
        super.onPause();
        getPreferenceScreen().getSharedPreferences()
                .unregisterOnSharedPreferenceChangeListener(this);
    }
}