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
import com.ripoffsteam.utils.NotificationHelper;
import com.google.android.material.navigation.NavigationView;
import android.view.View;
import android.widget.TextView;
import java.util.Set;
import java.util.regex.Pattern;

/**
 * Fragment para gerenciar as preferências da aplicação
 * VERSÃO ATUALIZADA - Com botão de teste de notificação
 */
public class PreferencesFragment extends PreferenceFragmentCompat
        implements SharedPreferences.OnSharedPreferenceChangeListener {

    private SharedPreferences sharedPreferences;
    private NotificationHelper notificationHelper;

    // Pattern para validação de email
    private static final Pattern EMAIL_PATTERN = Pattern.compile(
            "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"
    );

    @Override
    public void onCreatePreferences(Bundle savedInstanceState, String rootKey) {
        // Carrega as preferências a partir do XML
        setPreferencesFromResource(R.xml.preferences, rootKey);

        // Obtém referência às SharedPreferences
        sharedPreferences = getPreferenceScreen().getSharedPreferences();

        // Inicializa o NotificationHelper
        notificationHelper = new NotificationHelper(requireContext());

        // Inicializa os summaries
        initSummaries();

        // Configura listeners específicos
        setupSpecificListeners();
    }

    /**
     * Configura listeners para preferências específicas
     */
    private void setupSpecificListeners() {
        // Listener para mudança de tema imediata
        ListPreference themePref = findPreference(getString(R.string.pref_theme_key));
        if (themePref != null) {
            themePref.setOnPreferenceChangeListener((preference, newValue) -> {
                applyThemeChange((String) newValue);
                return true;
            });
        }

        // Listener para teste de notificação
        CheckBoxPreference notificationPref = findPreference(getString(R.string.pref_notification_key));
        if (notificationPref != null) {
            notificationPref.setOnPreferenceChangeListener((preference, newValue) -> {
                boolean enabled = (Boolean) newValue;
                handleNotificationToggle(enabled);
                return true;
            });
        }

        // NOVO: Listener para o botão de teste de notificação
        Preference testNotificationPref = findPreference(getString(R.string.pref_test_notification_key));
        if (testNotificationPref != null) {
            testNotificationPref.setOnPreferenceClickListener(preference -> {
                handleTestNotification();
                return true;
            });
        }

        // Listener para validação de username e atualização do nav header
        EditTextPreference usernamePref = findPreference(getString(R.string.pref_set_username_key));
        if (usernamePref != null) {
            usernamePref.setOnPreferenceChangeListener((preference, newValue) -> {
                String username = (String) newValue;
                if (username != null && username.trim().length() >= 2) {
                    showToast("Username atualizado: " + username);
                    // Atualiza o nav header com o novo username, mantendo email atual
                    updateNavHeaderUsername(username);
                    return true;
                } else {
                    showToast("Username deve ter pelo menos 2 caracteres");
                    return false;
                }
            });
        }

        // NOVO: Listener para validação de email e atualização do nav header
        EditTextPreference emailPref = findPreference(getString(R.string.pref_set_email_key));
        if (emailPref != null) {
            emailPref.setOnPreferenceChangeListener((preference, newValue) -> {
                String email = (String) newValue;
                if (email != null && isValidEmail(email.trim())) {
                    showToast("Email atualizado: " + email);
                    // Atualiza o nav header com o novo email, mantendo username atual
                    updateNavHeaderEmail(email);
                    return true;
                } else {
                    showToast("Por favor, digite um email válido (ex: nome@exemplo.com)");
                    return false;
                }
            });
        }

        // Listener para switch de username (mostrar/esconder)
        SwitchPreferenceCompat usernameSwitchPref = findPreference(getString(R.string.pref_username_key));
        if (usernameSwitchPref != null) {
            usernameSwitchPref.setOnPreferenceChangeListener((preference, newValue) -> {
                boolean showUsername = (Boolean) newValue;
                updateNavHeaderBasedOnUserSettings();
                return true;
            });
        }

        // Listener para SeekBar
        SeekBarPreference seekBarPref = findPreference(getString(R.string.pref_page_size_key));
        if (seekBarPref != null) {
            seekBarPref.setOnPreferenceChangeListener((preference, newValue) -> {
                int value = (Integer) newValue;
                showToast("Tamanho da página alterado para: " + value);
                return true;
            });
        }
    }

    /**
     * NOVO: Lida com o clique no botão de teste de notificação
     */
    private void handleTestNotification() {
        try {
            // Verifica se as notificações estão habilitadas no sistema
            if (!notificationHelper.areNotificationsEnabled()) {
                showToast("⚠️ Notificações estão desabilitadas nas configurações do sistema");
                return;
            }

            // Envia a notificação de teste
            notificationHelper.sendTestNotification();

            // Mostra feedback para o usuário
            showToast(getString(R.string.test_notification_sent));

            // Log para debug
            android.util.Log.d("PreferencesFragment", "✅ Notificação de teste enviada");

        } catch (Exception e) {
            android.util.Log.e("PreferencesFragment", "❌ Erro ao enviar notificação de teste: " + e.getMessage());
            showToast("Erro ao enviar notificação de teste");
        }
    }

    /**
     * Valida se o email tem formato correto
     */
    private boolean isValidEmail(String email) {
        return email != null && EMAIL_PATTERN.matcher(email).matches();
    }

    /**
     * Inicializa os summaries de todas as preferências
     */
    private void initSummaries() {
        if (sharedPreferences == null) return;

        // Atualiza summary para cada preferência
        updateSummary(getString(R.string.pref_set_username_key));
        updateSummary(getString(R.string.pref_set_email_key));
        updateSummary(getString(R.string.pref_theme_key));
        updateSummary(getString(R.string.pref_language_key));
        updateSummary(getString(R.string.pref_cache_duration_key));
        updateSummary(getString(R.string.pref_page_size_key));
        updateSummary(getString(R.string.pref_notification_key));
        updateSummary(getString(R.string.pref_notification_time_key));
        updateSummary(getString(R.string.pref_username_key));
    }

    /**
     * Atualiza o summary de uma preferência específica
     */
    private void updateSummary(String key) {
        Preference preference = findPreference(key);
        if (preference == null || sharedPreferences == null) return;

        try {
            if (preference instanceof EditTextPreference) {
                String value = sharedPreferences.getString(key, "");

                // Para email, mostra mensagem especial se estiver vazio
                if (key.equals(getString(R.string.pref_set_email_key))) {
                    preference.setSummary(value.isEmpty() ?
                            "Email será gerado automaticamente baseado no username" : value);
                } else {
                    preference.setSummary(value.isEmpty() ?
                            getString(R.string.not_set) : value);
                }
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
                    preference.setSummary("Selecionados: " + values.size());
                } else {
                    preference.setSummary(getString(R.string.none_selected));
                }
            }
            else if (preference instanceof SeekBarPreference) {
                int value = sharedPreferences.getInt(key, 20);
                preference.setSummary("Valor atual: " + value);
            }
        } catch (Exception e) {
            // Em caso de erro, define summary padrão
            preference.setSummary("Erro ao carregar valor");
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
        try {
            if (key.equals(getString(R.string.pref_set_username_key))) {
                String username = prefs.getString(key, "");
                if (!username.isEmpty()) {
                    showToast("Username atualizado: " + username);
                    updateNavHeaderUsername(username);
                }
            }
            else if (key.equals(getString(R.string.pref_notification_time_key))) {
                String time = prefs.getString(key, "09:00");
                if (prefs.getBoolean(getString(R.string.pref_notification_key), true)) {
                    NotificationScheduler.scheduleDailyNotification(requireContext());
                    showToast("Horário de notificação alterado para: " + time);
                }
            }
            else if (key.equals(getString(R.string.pref_cache_duration_key))) {
                String duration = prefs.getString(key, "24");
                showToast("Duração do cache alterada para: " + duration + " horas");
            }
            else if (key.equals(getString(R.string.pref_page_size_key))) {
                int pageSize = prefs.getInt(key, 20);
                showToast("Tamanho da página: " + pageSize + " jogos");
            }
        } catch (Exception e) {
            showToast("Erro ao aplicar mudança: " + e.getMessage());
        }
    }

    /**
     * Atualiza apenas o username no nav header
     */
    private void updateNavHeaderUsername(String username) {
        try {
            if (getActivity() == null) return;

            NavigationView navigationView = getActivity().findViewById(R.id.nav_view);
            if (navigationView == null) return;

            View headerView = navigationView.getHeaderView(0);
            if (headerView == null) return;

            TextView navHeaderTitle = headerView.findViewById(R.id.nav_header_title);

            if (navHeaderTitle != null) {
                navHeaderTitle.setText(username);
            }

        } catch (Exception e) {
            showToast("Erro ao atualizar username no nav header: " + e.getMessage());
        }
    }

    /**
     * Atualiza apenas o email no nav header
     */
    private void updateNavHeaderEmail(String email) {
        try {
            if (getActivity() == null) return;

            NavigationView navigationView = getActivity().findViewById(R.id.nav_view);
            if (navigationView == null) return;

            View headerView = navigationView.getHeaderView(0);
            if (headerView == null) return;

            TextView navHeaderSubtitle = headerView.findViewById(R.id.nav_header_subtitle);

            if (navHeaderSubtitle != null) {
                navHeaderSubtitle.setText(email);
            }

        } catch (Exception e) {
            showToast("Erro ao atualizar email no nav header: " + e.getMessage());
        }
    }

    /**
     * Atualiza o nav header baseado nas configurações do usuário
     */
    private void updateNavHeaderBasedOnUserSettings() {
        try {
            if (sharedPreferences == null) return;

            boolean showUsername = sharedPreferences.getBoolean(getString(R.string.pref_username_key), true);
            String username = sharedPreferences.getString(getString(R.string.pref_set_username_key), getString(R.string.default_username));
            String email = sharedPreferences.getString(getString(R.string.pref_set_email_key), "");

            if (showUsername) {
                updateNavHeaderUsername(username);

                // Se não há email personalizado, gera um baseado no username
                if (email.isEmpty()) {
                    email = generateEmailFromUsername(username);
                }
                updateNavHeaderEmail(email);
            } else {
                updateNavHeaderUsername(getString(R.string.default_username));
                updateNavHeaderEmail(getString(R.string.default_user_email));
            }

        } catch (Exception e) {
            showToast("Erro ao atualizar nav header: " + e.getMessage());
        }
    }

    /**
     * Gera um email baseado no username
     */
    private String generateEmailFromUsername(String username) {
        if (username == null || username.trim().isEmpty()) {
            return "user@ripoffsteam.com";
        }

        // Processa o username para criar um email válido
        String cleanUsername = username.toLowerCase()
                .replaceAll("\\s+", ".") // Substitui espaços por pontos
                .replaceAll("[^a-z0-9.]", "") // Remove caracteres especiais
                .replaceAll("\\.+", ".") // Remove pontos duplicados
                .replaceAll("^\\.|\\.$", "") // Remove pontos no início e fim
                .trim();

        if (cleanUsername.isEmpty()) {
            return "user@ripoffsteam.com";
        }

        return cleanUsername + "@ripoffsteam.com";
    }

    /**
     * Aplica mudança de tema imediatamente
     */
    private void applyThemeChange(String themeValue) {
        try {
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

            showToast("Tema aplicado!");

            // Reinicia a activity para aplicar o tema completamente
            if (getActivity() != null) {
                getActivity().recreate();
            }
        } catch (Exception e) {
            showToast("Erro ao aplicar tema: " + e.getMessage());
        }
    }

    /**
     * Lida com toggle de notificações
     */
    private void handleNotificationToggle(boolean enabled) {
        try {
            if (enabled) {
                NotificationScheduler.scheduleDailyNotification(requireContext());
                showToast("Notificações ativadas!");
            } else {
                NotificationScheduler.cancelDailyNotification(requireContext());
                showToast("Notificações desativadas!");
            }
        } catch (Exception e) {
            showToast("Erro ao configurar notificações: " + e.getMessage());
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

        // Inicializa o nav header com valores atuais
        initializeNavHeaderOnResume();
    }

    /**
     * Inicializa o nav header quando o fragment é resumido
     */
    private void initializeNavHeaderOnResume() {
        try {
            updateNavHeaderBasedOnUserSettings();
        } catch (Exception e) {
            // Erro silencioso na inicialização
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

        // Limpa referência do NotificationHelper
        notificationHelper = null;
    }
}