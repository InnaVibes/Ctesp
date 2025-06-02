package com.ripoffsteam.converters;

import androidx.room.TypeConverter;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import java.lang.reflect.Type;
import java.util.List;

// Classe com conversores para a base de dados Room
public class Converters {

    //Converte uma String JSON para uma Lista de Strings

    @TypeConverter
    public static List<String> fromString(String value) {
        Type listType = new TypeToken<List<String>>() {}.getType();
        return new Gson().fromJson(value, listType);
    }

    //Converte uma Lista de Strings para uma String no formato JSON
    @TypeConverter
    public static String fromList(List<String> list) {
        // Converte a Lista para JSON usando Gson
        return new Gson().toJson(list);
    }
}