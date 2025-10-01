import {Injectable} from '@angular/core';
import {supabase} from '../../../environments/environment';
import {Attempts} from '../../models/attempts/attempts';
import {AttemtpsAnswers} from '../../models/attempts-answers/attempts-answers';
import {BehaviorSubject} from 'rxjs';
import {NotificationService} from '../notification/notification-service';
import {NotificationType} from '../../models/notification/notification';

@Injectable({
  providedIn: 'root'
})
export class AttemptsAnswersService {
  public recoverAnswersUser = new BehaviorSubject<AttemtpsAnswers[]>([]);
  public correctCount: number = 0;
  private readonly PASSING_THRESHOLD: number = 75;

  constructor(private readonly notificationService: NotificationService) {}

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
    const isPassed = percentage >= this.PASSING_THRESHOLD;

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
      await this.createNotification(isPassed, percentage, quiz_id, quiz_name);
      this.recoverAnswersUser.next([]);
    }

    return { percentage, isPassed };
  }

  private async createNotification(
    isPassed: boolean,
    percentage: number,
    quiz_id: string | null | undefined,
    quiz_name?: string
  ) {
    const metadata = {
      quiz_id: quiz_id ?? undefined,
      quiz_name: quiz_name,
      percentage: Math.round(percentage)
    };

    if (isPassed) {
      const quizNameSuffix = quiz_name ? ` "${quiz_name}"` : '';
      const message = `Félicitations ! Vous avez réussi le quiz${quizNameSuffix} avec ${Math.round(percentage)}%.`;

      await this.notificationService.addNotification(
        NotificationType.QuizPassed,
        'Quiz réussi !',
        message,
        metadata
      );
     } else {
      await this.notificationService.addNotification(
        NotificationType.QuizFailed,
        'Quiz échoué',
        `Vous n'avez pas atteint le score minimum de ${this.PASSING_THRESHOLD}%. Votre score : ${Math.round(percentage)}%. Réessayez !`,
        metadata
      );
    }
  }
}
