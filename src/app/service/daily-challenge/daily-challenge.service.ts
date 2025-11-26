import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { supabase } from '../../../environments/environment';
import { Quiz } from '../../models/quiz/quiz';

interface CreateDailyQuizResponse {
  success: boolean;
  quizId?: string;
  title?: string;
  questionsCount?: number;
  message?: string;
  error?: string;
}

interface Question {
  id: string;
  text: string;
  quiz_id: string;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class DailyChallengeService {
  public todayQuiz$ = new BehaviorSubject<Quiz | null>(null);

  /**
   * Récupérer le quiz quotidien valide pour aujourd'hui
   * @returns Le quiz quotidien ou null s'il n'existe pas
   */
  public async getTodayQuiz(): Promise<Quiz | null> {
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('quizzes')
      .select(`
        *,
        questions(*),
        category:categories!quizzes_category_id_fkey (
          *
        )
      `)
      .eq('is_daily_challenge', true)
      .gte('valid_until', now)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Erreur lors de la récupération du quiz quotidien:', error);
      this.todayQuiz$.next(null);
      return null;
    }

    this.todayQuiz$.next(data);
    return data;
  }

  /**
   * Vérifier si un quiz quotidien existe pour aujourd'hui
   * @returns true si un quiz quotidien valide existe
   */
  public async hasTodayQuiz(): Promise<boolean> {
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('quizzes')
      .select('id')
      .eq('is_daily_challenge', true)
      .gte('valid_until', now)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Erreur lors de la vérification du quiz quotidien:', error);
      return false;
    }

    return !!data;
  }

  /**
   * Créer manuellement le quiz quotidien pour aujourd'hui
   * Crée directement le quiz via Supabase sans passer par une Edge Function
   * @returns Le résultat de la création
   */
  public async createTodayQuiz(): Promise<CreateDailyQuizResponse> {
    try {
      // Vérifier si un quiz quotidien existe déjà
      const existingQuiz = await this.getTodayQuiz();
      if (existingQuiz) {
        return {
          success: true,
          message: 'Un quiz quotidien existe déjà pour aujourd\'hui',
          quizId: existingQuiz.id,
          title: existingQuiz.title,
        };
      }

      // Récupérer des questions aléatoires (jusqu'à 100 questions puis en sélectionner 10)
      const { data: allQuestions, error: questionsError } = await supabase
        .from('questions')
        .select('id, text, quiz_id, created_at')
        .limit(100);

      if (questionsError) {
        throw new Error(`Erreur lors de la récupération des questions: ${questionsError.message}`);
      }

      if (!allQuestions || allQuestions.length === 0) {
        return {
          success: false,
          error: 'Aucune question disponible pour créer le quiz quotidien',
        };
      }

      // Fisher-Yates shuffle pour une sélection aléatoire équitable
      const shuffled = [...allQuestions];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      const selectedQuestions = shuffled.slice(0, Math.min(10, shuffled.length));

      // Calculer la date d'expiration (fin de journée demain)
      const today = new Date();
      const validUntil = new Date(today);
      validUntil.setDate(validUntil.getDate() + 1);
      validUntil.setHours(23, 59, 59, 999);

      // Formater la date pour le titre en français
      const dateOptions: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      };
      const formattedDate = today.toLocaleDateString('fr-FR', dateOptions);

      // Récupérer une catégorie aléatoire
      const { data: categories } = await supabase
        .from('categories')
        .select('id, name');

      const randomCategory = categories && categories.length > 0
        ? categories[Math.floor(Math.random() * categories.length)]
        : null;

      // Créer le quiz quotidien
      const { data: newQuiz, error: quizError } = await supabase
        .from('quizzes')
        .insert({
          title: `Défi Quotidien - ${formattedDate}`,
          description: `Quiz quotidien du ${formattedDate}. Complétez ce défi pour maintenir votre série!`,
          is_daily_challenge: true,
          valid_until: validUntil.toISOString(),
          difficulty: 'Moyen',
          category_id: randomCategory?.id || null,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (quizError) {
        throw new Error(`Erreur lors de la création du quiz: ${quizError.message}`);
      }

      // Copier les questions sélectionnées vers le nouveau quiz
      const questionsToInsert = selectedQuestions.map((q: Question) => ({
        text: q.text,
        quiz_id: newQuiz.id,
        created_at: new Date().toISOString(),
      }));

      const { data: insertedQuestions, error: insertQuestionsError } = await supabase
        .from('questions')
        .insert(questionsToInsert)
        .select();

      if (insertQuestionsError) {
        // Rollback: supprimer le quiz si l'insertion des questions échoue
        await supabase.from('quizzes').delete().eq('id', newQuiz.id);
        throw new Error(`Erreur lors de l'insertion des questions: ${insertQuestionsError.message}`);
      }

      // Copier les réponses pour chaque question
      for (let i = 0; i < selectedQuestions.length; i++) {
        const originalQuestion = selectedQuestions[i] as Question;
        const newQuestion = insertedQuestions[i];

        const { data: originalAnswers, error: answersError } = await supabase
          .from('answers')
          .select('text, is_correct')
          .eq('question_id', originalQuestion.id);

        if (answersError) {
          console.error(`Erreur lors de la récupération des réponses pour la question ${originalQuestion.id}:`, answersError);
          continue;
        }

        if (originalAnswers && originalAnswers.length > 0) {
          const answersToInsert = originalAnswers.map((a: { text: string; is_correct: boolean }) => ({
            question_id: newQuestion.id,
            text: a.text,
            is_correct: a.is_correct,
          }));

          const { error: insertAnswersError } = await supabase
            .from('answers')
            .insert(answersToInsert);

          if (insertAnswersError) {
            console.error('Erreur lors de l\'insertion des réponses:', insertAnswersError);
          }
        }
      }

      // Rafraîchir le quiz du jour après la création
      await this.getTodayQuiz();

      return {
        success: true,
        quizId: newQuiz.id,
        title: newQuiz.title,
        questionsCount: insertedQuestions.length,
      };
    } catch (error) {
      console.error('Erreur lors de la création du quiz quotidien:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      };
    }
  }
}
