package com.ripoffsteam.fragments;

import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.ripoffsteam.GameDetailActivity;
import com.ripoffsteam.R;
import com.ripoffsteam.adapters.GameAdapter;
import com.ripoffsteam.modelos.Game;
import java.util.ArrayList;
import com.ripoffsteam.utils.WishlistManager;
import android.widget.LinearLayout;

//Fragment que exibe a lista de jogos desejados do utilizador
public class WishlistFragment extends Fragment implements GameAdapter.OnGameClickListener {
    private RecyclerView wishlistRecycler; // RecyclerView para mostrar os jogos
    private LinearLayout emptyState; // Layout para estado vazio
    private GameAdapter adapter; // Adaptador para a lista de jogos
    private WishlistManager wishlistManager; // Gestor da lista de jogos desejados

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {

        View view = inflater.inflate(R.layout.fragment_wishlist, container, false);

        // Inicializa as views
        wishlistRecycler = view.findViewById(R.id.wishlist_recycler);
        emptyState = view.findViewById(R.id.empty_state);

        // Obtém a instância do gestor de lista de desejos
        wishlistManager = WishlistManager.getInstance();

        // Configura o adaptador com a lista atual de desejos
        adapter = new GameAdapter(new ArrayList<>(wishlistManager.getWishlist()), this);
        wishlistRecycler.setLayoutManager(new LinearLayoutManager(getContext()));
        wishlistRecycler.setAdapter(adapter);

        // Atualiza a visibilidade conforme o conteúdo
        updateWishlistVisibility();

        return view;
    }

    @Override
    public void onResume() {
        super.onResume();
        // Atualiza a lista quando o fragmento torna-se visível
        refreshWishlist();
    }

    //Metodo invocado quando se clica num jogo
    @Override
    public void onGameClick(Game game) {
        // Abre a atividade de detalhe do jogo
        Intent intent = new Intent(getActivity(), GameDetailActivity.class);
        intent.putExtra("GAME_ID", game.getId()); // Passa apenas o ID
        startActivity(intent);
    }

    //Dá update na lista de jogos desejados
    public void refreshWishlist() {
        if (adapter != null) {
            // Atualiza o adaptador com a lista atualizada
            adapter.updateGames(new ArrayList<>(wishlistManager.getWishlist()));
            updateWishlistVisibility();
        }
    }


    private void updateWishlistVisibility() {
        if (adapter == null || adapter.getItemCount() == 0) {
            // Mostra estado vazio se não houver itens
            wishlistRecycler.setVisibility(View.GONE);
            emptyState.setVisibility(View.VISIBLE);
        } else {
            // Mostra a lista se houver itens
            wishlistRecycler.setVisibility(View.VISIBLE);
            emptyState.setVisibility(View.GONE);
        }
    }
}