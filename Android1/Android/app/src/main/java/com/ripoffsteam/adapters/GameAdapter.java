package com.ripoffsteam.adapters;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.ripoffsteam.R;
import com.ripoffsteam.modelos.Game;
import java.util.List;
import android.content.Intent;
import com.ripoffsteam.GameDetailActivity;
import com.bumptech.glide.Glide;

// Adaptador para a RecyclerView que mostra uma lista de jogos
public class GameAdapter extends RecyclerView.Adapter<GameAdapter.GameViewHolder> {

    private List<Game> games; // Lista de jogos a serem exibidos
    private OnGameClickListener listener; // Listener para cliques nos jogos

    // Construtor do adaptador
    public GameAdapter(List<Game> games, OnGameClickListener listener) {
        this.games = games;
        this.listener = listener;
    }

    // Interface para lidar com cliques nos jogos
    public interface OnGameClickListener {
        void onGameClick(Game game);
    }

    // Cria uma nova ViewHolder quando necessário
    @NonNull
    @Override
    public GameViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        // Infla o layout do item do jogo
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.game_item, parent, false);
        return new GameViewHolder(view);
    }

    // Liga os dados do jogo à ViewHolder
    @Override
    public void onBindViewHolder(@NonNull GameViewHolder holder, int position) {
        Game game = games.get(position);

        // Define os textos nas TextViews
        holder.gameName.setText(game.getName());
        holder.gameStudio.setText(game.getStudio());
        holder.gameRating.setText(String.format("Rating: %.1f/5", game.getRating()));

        // NOVA LINHA: Carrega imagem real ou placeholder
        String imageUrl = game.getImageUrl();
        if (imageUrl != null && !imageUrl.isEmpty()) {
            Glide.with(holder.gameImage.getContext())
                    .load(imageUrl)
                    .placeholder(R.drawable.ic_game_placeholder)
                    .error(R.drawable.ic_game_placeholder)
                    .into(holder.gameImage);
        } else {
            holder.gameImage.setImageResource(R.drawable.ic_game_placeholder);
        }

        // Define o clique no item para abrir a atividade de detalhe do jogo
        holder.itemView.setOnClickListener(v -> {
            Intent intent = new Intent(v.getContext(), GameDetailActivity.class);
            intent.putExtra("GAME_ID", game.getId());
            v.getContext().startActivity(intent);
        });
    }

    // Retorna o número total de itens na lista
    @Override
    public int getItemCount() {
        return games.size();
    }

    // Atualiza a lista de jogos e notifica a RecyclerView
    public void updateGames(List<Game> newGames) {
        this.games = newGames;
        notifyDataSetChanged(); // Atualiza a RecyclerView
    }

    // ViewHolder que representa cada item do jogo na RecyclerView
    static class GameViewHolder extends RecyclerView.ViewHolder {
        ImageView gameImage; // Imagem do jogo
        TextView gameName;   // Nome do jogo
        TextView gameStudio; // Estúdio do jogo
        TextView gameRating; // Classificação do jogo

        public GameViewHolder(@NonNull View itemView) {
            super(itemView);
            // Obtém as referências das views do layout
            gameImage = itemView.findViewById(R.id.game_image);
            gameName = itemView.findViewById(R.id.game_name);
            gameStudio = itemView.findViewById(R.id.game_studio);
            gameRating = itemView.findViewById(R.id.game_rating);
        }
    }

    // Adiciona um jogo à lista
    public void addGame(Game game) {
        if (!games.contains(game)) {
            games.add(game);
            notifyItemInserted(games.size() - 1);
        }
    }

    // Remove um jogo da lista
    public void removeGame(Game game) {
        int position = games.indexOf(game);
        if (position != -1) {
            games.remove(position);
            notifyItemRemoved(position);
        }
    }
}