package com.ripoffsteam.converters;

import androidx.room.TypeConverter;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

/**
 * Classe com conversores simplificados para a base de dados Room
 * Apenas para listas de strings (campos processados)
 */
public class Converters {

    private static final Gson gson = new Gson();

    // Conversores para List<String> (campos processados)
    @TypeConverter
    public static List<String> fromString(String value) {
        if (value == null || value.trim().isEmpty()) {
            return new ArrayList<>();
        }
        try {
            Type listType = new TypeToken<List<String>>() {}.getType();
            List<String> result = gson.fromJson(value, listType);
            return result != null ? result : new ArrayList<>();
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    @TypeConverter
    public static String fromStringList(List<String> list) {
        if (list == null || list.isEmpty()) {
            return "";
        }
        try {
            return gson.toJson(list);
        } catch (Exception e) {
            return "";
        }
    }

    // Métodos utilitários para validação
    public static boolean isValidJson(String jsonString) {
        if (jsonString == null || jsonString.trim().isEmpty()) {
            return false;
        }
        try {
            gson.fromJson(jsonString, Object.class);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public static <T> List<T> safeJsonToList(String json, Class<T> clazz) {
        if (json == null || json.trim().isEmpty()) {
            return new ArrayList<>();
        }
        try {
            Type listType = TypeToken.getParameterized(List.class, clazz).getType();
            List<T> result = gson.fromJson(json, listType);
            return result != null ? result : new ArrayList<>();
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    public static <T> String safeListToJson(List<T> list) {
        if (list == null || list.isEmpty()) {
            return "";
        }
        try {
            return gson.toJson(list);
        } catch (Exception e) {
            return "";
        }
    }
}