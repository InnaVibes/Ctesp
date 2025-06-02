package com.ripoffsteam.utils;

import com.ripoffsteam.modelos.Game;
import java.util.ArrayList;
import java.util.List;


 //Classe responsável por gerir a lista de desejos (wishlist) de jogos.

public class WishlistManager {
    // Instância única da classe (padrão Singleton)
    private static WishlistManager instance;

    // Lista que armazena os jogos da lista de desejos
    private List<Game> wishlistGames = new ArrayList<>();


     //Obtém a instância única do WishlistManager

    public static WishlistManager getInstance() {
        if (instance == null) {
            instance = new WishlistManager();
        }
        return instance;
    }


     //Verifica se um jogo já está na lista de desejos
    //true se o jogo estiver na lista, false caso contrário

    public boolean isInWishlist(Game game) {
        for (Game wishlistGame : wishlistGames) {
            if (wishlistGame.getId().equals(game.getId())) {
                return true;
            }
        }
        return false;
    }


     //Adiciona um jogo à lista de desejos, se ainda não estiver presente
    public void addToWishlist(Game game) {
        if (!isInWishlist(game)) {
            wishlistGames.add(game);
        }
    }


     //Remove um jogo da lista de desejos
    public void removeFromWishlist(Game game) {
        for (int i = 0; i < wishlistGames.size(); i++) {
            if (wishlistGames.get(i).getId().equals(game.getId())) {
                wishlistGames.remove(i);
                break; // Sai do loop após encontrar e remover o jogo
            }
        }
    }


    //Obtém uma cópia da lista atual de desejos

    public List<Game> getWishlist() {
        // Retorna uma cópia da lista de desejos
        return new ArrayList<>(wishlistGames);
    }
}