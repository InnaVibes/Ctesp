package com.ripoffsteam.adapters;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.ripoffsteam.R;
import com.ripoffsteam.utils.AchievementManager;
import java.util.ArrayList;
import java.util.List;

/**
 * Adapter para exibir conquistas/achievements
 */
public class AchievementAdapter extends RecyclerView.Adapter<AchievementAdapter.AchievementViewHolder> {

    private List<AchievementManager.Achievement> achievements = new ArrayList<>();

    @NonNull
    @Override
    public AchievementViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.achievement_item, parent, false);
        return new AchievementViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull AchievementViewHolder holder, int position) {
        AchievementManager.Achievement achievement = achievements.get(position);

        holder.titleText.setText(achievement.title);
        holder.descriptionText.setText(achievement.description);
        holder.iconImage.setImageResource(achievement.iconResource);

        // Define o estilo baseado no status da conquista
        if (achievement.isUnlocked) {
            holder.itemView.setAlpha(1.0f);
            holder.statusImage.setImageResource(R.drawable.ic_achievement_unlocked);
            holder.statusImage.setVisibility(View.VISIBLE);
            holder.titleText.setTextColor(holder.itemView.getContext()
                    .getResources().getColor(R.color.black));
        } else {
            holder.itemView.setAlpha(0.5f);
            holder.statusImage.setImageResource(R.drawable.ic_achievement_locked);
            holder.statusImage.setVisibility(View.VISIBLE);
            holder.titleText.setTextColor(holder.itemView.getContext()
                    .getResources().getColor(R.color.gray));
        }
    }

    @Override
    public int getItemCount() {
        return achievements.size();
    }

    /**
     * Atualiza a lista de conquistas
     */
    public void updateAchievements(List<AchievementManager.Achievement> newAchievements) {
        this.achievements.clear();
        this.achievements.addAll(newAchievements);
        notifyDataSetChanged();
    }

    /**
     * ViewHolder para itens de conquista
     */
    static class AchievementViewHolder extends RecyclerView.ViewHolder {
        ImageView iconImage;
        ImageView statusImage;
        TextView titleText;
        TextView descriptionText;

        public AchievementViewHolder(@NonNull View itemView) {
            super(itemView);
            iconImage = itemView.findViewById(R.id.achievement_icon);
            statusImage = itemView.findViewById(R.id.achievement_status);
            titleText = itemView.findViewById(R.id.achievement_title);
            descriptionText = itemView.findViewById(R.id.achievement_description);
        }
    }
}
