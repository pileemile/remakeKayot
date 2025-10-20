import { Injectable } from '@angular/core';
import {supabase} from '../../../../environments/environment';
import {LevelService} from '../../level/level-service';

@Injectable({
  providedIn: 'root'
})
export class UserXpService {
  public async addXpToUser(userId: string, xpToAdd: number): Promise<void> {
    try {
      // 1️⃣ Récupère l’XP actuel
      const {data: userLevel, error: selectError} = await supabase
        .from('user_levels')
        .select('current_xp')
        .eq('user_id', userId)
        .single();

      if (selectError) {
        console.error("❌ Erreur lors de la récupération de l'XP :", selectError);
        return;
      }

      const newXp = (userLevel?.current_xp ?? 0) + xpToAdd;

      // 2️⃣ Met à jour l’XP dans la table user_levels
      const {error: updateError} = await supabase
        .from('user_levels')
        .update({
          current_xp: newXp,
          total_xp: newXp,
          last_update: new Date().toISOString(),
        })
        .eq('user_id', userId);

      if (updateError) {
        console.error("❌ Erreur lors de la mise à jour de l'XP :", updateError);
        return;
      }

      console.log(`✅ ${xpToAdd} XP ajoutés avec succès à l'utilisateur ${userId}`);

      // 3️⃣ Vérifie si un passage de niveau est nécessaire
      const levelService = new LevelService();
      await levelService.updateUserLevelIfNeeded(userId);
    } catch (err) {
      console.error("⚠️ Erreur inattendue dans addXpToUser :", err);

    }

  }
}
