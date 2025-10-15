package com.ripoffsteam.utils;

import android.content.Context;
import android.widget.ImageView;
import com.bumptech.glide.Glide;
import com.bumptech.glide.load.engine.DiskCacheStrategy;
import com.bumptech.glide.request.RequestOptions;
import com.ripoffsteam.R;
import android.util.Log;

/**
 * Classe utilitária para carregar imagens de jogos usando Glide
 * Centraliza a configuração de carregamento de imagens
 */
public class ImageLoader {

    private static final String TAG = "ImageLoader";

    /**
     * Carrega imagem para lista de jogos (tamanho pequeno)
     */
    public static void loadGameImageForList(Context context, ImageView imageView, String imageUrl) {
        Log.d(TAG, "🖼️ Carregando imagem para lista: " + (imageUrl != null ? imageUrl : "null"));

        loadImage(context, imageView, imageUrl,
                new RequestOptions()
                        .placeholder(R.drawable.ic_game_placeholder)
                        .error(R.drawable.ic_game_placeholder)
                        .centerCrop()
                        .diskCacheStrategy(DiskCacheStrategy.ALL)
                        .override(200, 200)); // Tamanho otimizado para listas
    }

    /**
     * Carrega imagem para detalhes do jogo (tamanho grande)
     */
    public static void loadGameImageForDetail(Context context, ImageView imageView, String imageUrl) {
        Log.d(TAG, "🖼️ Carregando imagem para detalhes: " + (imageUrl != null ? imageUrl : "null"));

        loadImage(context, imageView, imageUrl,
                new RequestOptions()
                        .placeholder(R.drawable.ic_game_placeholder)
                        .error(R.drawable.ic_game_placeholder)
                        .centerCrop()
                        .diskCacheStrategy(DiskCacheStrategy.ALL)
                        .override(800, 600)); // Tamanho maior para detalhes
    }

    /**
     * Carrega imagem para cards horizontais (Home)
     */
    public static void loadGameImageForCard(Context context, ImageView imageView, String imageUrl) {
        Log.d(TAG, "🖼️ Carregando imagem para card: " + (imageUrl != null ? imageUrl : "null"));

        loadImage(context, imageView, imageUrl,
                new RequestOptions()
                        .placeholder(R.drawable.ic_game_placeholder)
                        .error(R.drawable.ic_game_placeholder)
                        .centerCrop()
                        .diskCacheStrategy(DiskCacheStrategy.ALL)
                        .override(300, 200)); // Tamanho para cards
    }

    /**
     * Carrega imagem com configurações personalizadas
     */
    public static void loadGameImageCustom(Context context, ImageView imageView, String imageUrl,
                                           int width, int height) {
        Log.d(TAG, "🖼️ Carregando imagem personalizada: " + width + "x" + height);

        loadImage(context, imageView, imageUrl,
                new RequestOptions()
                        .placeholder(R.drawable.ic_game_placeholder)
                        .error(R.drawable.ic_game_placeholder)
                        .centerCrop()
                        .diskCacheStrategy(DiskCacheStrategy.ALL)
                        .override(width, height));
    }

    /**
     * Método base para carregar imagens
     */
    private static void loadImage(Context context, ImageView imageView, String imageUrl, RequestOptions options) {
        if (imageView == null) {
            Log.w(TAG, "⚠️ ImageView é null, não é possível carregar imagem");
            return;
        }

        if (context == null) {
            Log.w(TAG, "⚠️ Context é null, não é possível carregar imagem");
            return;
        }

        try {
            if (imageUrl != null && !imageUrl.trim().isEmpty()) {
                Log.d(TAG, "✅ Carregando imagem da URL: " + imageUrl);

                Glide.with(context)
                        .load(imageUrl)
                        .apply(options)
                        .into(imageView);
            } else {
                Log.d(TAG, "📷 Usando placeholder (URL vazia ou null)");

                Glide.with(context)
                        .load(R.drawable.ic_game_placeholder)
                        .apply(options)
                        .into(imageView);
            }
        } catch (Exception e) {
            Log.e(TAG, "❌ Erro ao carregar imagem: " + e.getMessage());

            // Fallback para placeholder em caso de erro
            try {
                Glide.with(context)
                        .load(R.drawable.ic_game_placeholder)
                        .apply(options)
                        .into(imageView);
            } catch (Exception fallbackError) {
                Log.e(TAG, "❌ Erro crítico no fallback: " + fallbackError.getMessage());
            }
        }
    }

    /**
     * Limpa cache de imagens (para configurações/debugging)
     */
    public static void clearImageCache(Context context) {
        if (context == null) {
            Log.w(TAG, "⚠️ Context é null, não é possível limpar cache");
            return;
        }

        try {
            Log.d(TAG, "🧹 Limpando cache de imagens...");

            // Limpa cache da memória
            Glide.get(context).clearMemory();

            // Limpa cache do disco em background thread
            new Thread(() -> {
                try {
                    Glide.get(context).clearDiskCache();
                    Log.d(TAG, "✅ Cache de disco limpo");
                } catch (Exception e) {
                    Log.e(TAG, "❌ Erro ao limpar cache de disco: " + e.getMessage());
                }
            }).start();

        } catch (Exception e) {
            Log.e(TAG, "❌ Erro ao limpar cache: " + e.getMessage());
        }
    }

    /**
     * Pré-carrega imagem no cache
     */
    public static void preloadImage(Context context, String imageUrl) {
        if (context == null || imageUrl == null || imageUrl.trim().isEmpty()) {
            Log.w(TAG, "⚠️ Não é possível pré-carregar: context ou URL inválida");
            return;
        }

        try {
            Log.d(TAG, "⏬ Pré-carregando imagem: " + imageUrl);

            Glide.with(context)
                    .load(imageUrl)
                    .diskCacheStrategy(DiskCacheStrategy.ALL)
                    .preload();

        } catch (Exception e) {
            Log.e(TAG, "❌ Erro ao pré-carregar imagem: " + e.getMessage());
        }
    }

    /**
     * Verifica se uma URL de imagem é válida
     */
    public static boolean isValidImageUrl(String imageUrl) {
        if (imageUrl == null || imageUrl.trim().isEmpty()) {
            return false;
        }

        String url = imageUrl.toLowerCase().trim();
        return url.startsWith("http://") || url.startsWith("https://");
    }

    /**
     * Obtém configurações padrão do Glide
     */
    public static RequestOptions getDefaultOptions() {
        return new RequestOptions()
                .placeholder(R.drawable.ic_game_placeholder)
                .error(R.drawable.ic_game_placeholder)
                .centerCrop()
                .diskCacheStrategy(DiskCacheStrategy.ALL);
    }

    /**
     * Obtém configurações para thumbnails
     */
    public static RequestOptions getThumbnailOptions() {
        return getDefaultOptions()
                .override(100, 100);
    }

    /**
     * Obtém configurações para imagens de alta qualidade
     */
    public static RequestOptions getHighQualityOptions() {
        return getDefaultOptions()
                .override(1200, 800);
    }
}