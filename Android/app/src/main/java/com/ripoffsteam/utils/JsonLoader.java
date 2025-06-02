package com.ripoffsteam.utils;

import android.content.Context;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.ripoffsteam.modelos.Game;
import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.Type;
import java.util.List;


 //Classe utilitária para carregar dados de jogos a partir de um ficheiro JSON

public class JsonLoader {


     //Carrega a lista de jogos a partir do ficheiro JSON localizado nos assets

    public static List<Game> loadGames(Context context) {
        try {
            InputStream is = context.getAssets().open("games.json");

            //  Lê o conteúdo do ficheiro para um buffer
            int size = is.available();
            byte[] buffer = new byte[size];
            is.read(buffer);
            is.close();

            // Converte o buffer para uma string JSON
            String json = new String(buffer, "UTF-8");

            //  Define o tipo de dados para a conversão (Lista de Games)
            Type listType = new TypeToken<List<Game>>() {}.getType();

            //  Converte o JSON para objetos Game usando a biblioteca Gson
            return new Gson().fromJson(json, listType);

        } catch (IOException e) {
            // Log do erro
            e.printStackTrace();
            return null;
        }
    }
}