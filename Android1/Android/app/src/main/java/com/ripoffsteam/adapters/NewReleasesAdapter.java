package com.ripoffsteam.adapters;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import android.widget.ImageView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.ripoffsteam.modelos.Game;
import com.bumptech.glide.Glide;
import com.ripoffsteam.R;

import java.util.List;

// Adaptador para a RecyclerView que mostra os lançamentos mais recentes de jogos
public class NewReleasesAdapter extends RecyclerView.Adapter<NewReleasesAdapter.ViewHolder> {

    private List<Game> games; // Lista de jogos recentes
    private OnGameClickListener listener; // Listener para cliques nos jogos

    // Interface para lidar com cliques nos itens
    public interface OnGameClickListener {
        void onGameClick(Game game);
    }

    public NewReleasesAdapter(List<Game> games) {
        this.games = games;
    }

    // Define o listener para cliques nos jogos
    public void setOnGameClickListener(OnGameClickListener listener) {
        this.listener = listener;
    }

    // Cria novas ViewHolders quando necessário
    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        // Usa o layout recomendado
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.recommended_game_item, parent, false);
        return new ViewHolder(view);
    }

    // Preenche os dados dos jogos nas ViewHolders
    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        Game game = games.get(position);

        // Define o nome do jogo na TextView
        holder.textView.setText(game.getName());

        // NOVA SEÇÃO: Carrega imagem real
        if (holder.imageView != null) {
            String imageUrl = game.getImageUrl();
            if (imageUrl != null && !imageUrl.isEmpty()) {
                Glide.with(holder.imageView.getContext())
                        .load(imageUrl)
                        .placeholder(R.drawable.ic_game_placeholder)
                        .error(R.drawable.ic_game_placeholder)
                        .into(holder.imageView);
            } else {
                holder.imageView.setImageResource(R.drawable.ic_game_placeholder);
            }
        }

        // Configura o clique no item
        holder.itemView.setOnClickListener(v -> {
            if (listener != null) {
                listener.onGameClick(game); // Notifica o listener sobre o clique
            }
        });
    }

    // Retorna o número total de itens
    @Override
    public int getItemCount() {
        return games.size();
    }

    // ViewHolder que contém as views para cada item da lista
    public static class ViewHolder extends RecyclerView.ViewHolder {
        public TextView textView; // TextView que mostra o nome do jogo
        public ImageView imageView; // ImageView para a imagem do jogo

        public ViewHolder(View itemView) {
            super(itemView);
            // Obtém a referência das views do layout
            textView = itemView.findViewById(R.id.game_name);
            imageView = itemView.findViewById(R.id.game_image);
        }
    }
}