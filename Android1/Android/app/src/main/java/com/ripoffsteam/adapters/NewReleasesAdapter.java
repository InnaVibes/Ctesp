package com.ripoffsteam.adapters;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.ripoffsteam.modelos.Game;

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
        // Usa um layout simples do Android para cada item
        View view = LayoutInflater.from(parent.getContext())
                .inflate(android.R.layout.select_dialog_item, parent, false);
        return new ViewHolder(view);
    }

    // Preenche os dados dos jogos nas ViewHolders
    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        Game game = games.get(position);
        // Define o nome do jogo na TextView
        holder.textView.setText(game.getName());

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

        public ViewHolder(View itemView) {
            super(itemView);
            // Obtém a referência da TextView do layout padrão do Android
            textView = itemView.findViewById(android.R.id.text1);
        }
    }
}