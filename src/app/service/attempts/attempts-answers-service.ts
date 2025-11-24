import {Injectable} from '@angular/core';
import {supabase} from '../../../environments/environment';
import {Attempts} from '../../models/attempts/attempts';
import {AttemtpsAnswers} from '../../models/attempts-answers/attempts-answers';
import {BehaviorSubject} from 'rxjs';
import {NotificationService} from '../notification/notification-service';
import {NotificationType} from '../../models/notification/notification';
import {LevelService} from '../level/level-service';

@Injectable({
  providedIn: 'root'
})
export class AttemptsAnswersService {
  public recoverAnswersUser = new BehaviorSubject<AttemtpsAnswers[]>([]);
  public correctCount: number = 0;
  public passing_thresh = 75;

  constructor(
    private readonly notificationService: NotificationService,
    private readonly levelService: LevelService
  ) {}

  public async insertAttempts(total: number, quiz_id: string | null | undefined, quiz_name?: string) {
    const uniqueAnswers = new Map(
      this.recoverAnswersUser.value.map(a => [a.question_id, a])
    );
    const answersArray = Array.from(uniqueAnswers.values());

    const selectedIds = answersArray.map(a => a.selected_answer_id);

    const { data: correctAnswers, error } = await supabase
      .from('answers')
      .select('id, is_correct')
      .in('id', selectedIds);

    if (error) {
      console.error("Erreur lors de la récupération des réponses correctes", error);
      return;
    }

    this.correctCount = correctAnswers.filter(a => a.is_correct).length;
    const percentage = answersArray.length > 0 ? (this.correctCount / answersArray.length) * 100 : 0;
    const isPassed = percentage >= this.passing_thresh;

    const newAttempts: Attempts = {
      quiz_id: quiz_id ?? null,
      score: this.correctCount,
      total: answersArray.length,
      user_id: '22ce5a89-1db2-46e7-a265-c929697ff1d0',
      created_at: new Date().toISOString(),
    };

    const { data: insertedAttempt, error: insertError } = await supabase
      .from('attempts')
      .insert(newAttempts)
      .select()
      .single();

    if (insertError) {
      console.error("Erreur sur l'insertion des attempts", insertError);
      return;
    }

    console.log("Attempt inséré :", insertedAttempt);

    const attemptAnswers: AttemtpsAnswers[] = answersArray.map(a => ({
      question_id: a.question_id,
      quiz_id: a.quiz_id,
      selected_answer_id: a.selected_answer_id,
      user_id: a.user_id,
    }));

    const { error: answersError } = await supabase
      .from('attempt_answers')
      .insert(attemptAnswers);

    if (answersError) {
      console.error("Erreur sur l'insertion des attempt_answers", answersError);
    } else {
      console.log("Réponses insérées :", attemptAnswers);
      await this.notificationService.createNotification(isPassed, percentage, quiz_id, quiz_name, this.passing_thresh);
      this.recoverAnswersUser.next([]);
    }

    return { percentage, isPassed };
  }

  async addUserXp(userId: string, xpToAdd: number): Promise<void> {
    try {
      // 1️⃣ Récupération des infos actuelles
      const { data: userLevel } = await supabase
        .from('user_levels')
        .select('current_xp, total_xp')
        .eq('user_id', userId)
        .single();

      if (!userLevel) return;

      const newCurrentXp = userLevel.current_xp + xpToAdd;
      const newTotalXp = userLevel.total_xp + xpToAdd;

      // 2️⃣ Mise à jour de l'XP
      await supabase
        .from('user_levels')
        .update({
          current_xp: newCurrentXp,
          total_xp: newTotalXp,
          last_update: new Date().toISOString()
        })
        .eq('user_id', userId);

      // 3️⃣ ✅ Confirmation console
      console.log(`✅ ${xpToAdd} XP ajoutés avec succès à l'utilisateur ${userId}`);

      // 4️⃣ 🆕 Vérifie si l'utilisateur doit monter de niveau
      await this.levelService.updateUserLevelIfNeeded(userId);

    } catch (err) {
      console.error('❌ Erreur lors de la mise à jour du XP :', err);
    }
  }

}
