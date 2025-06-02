package com.ripoffsteam;

import android.app.Application;
import com.ripoffsteam.utils.ThemeManager;

public class RipoffSteamApplication extends Application {

    @Override
    public void onCreate() {
        super.onCreate();

        ThemeManager.applyTheme(this);
    }
}