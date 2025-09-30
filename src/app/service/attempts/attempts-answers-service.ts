import { Injectable } from '@angular/core';
import {Answers} from '../../models/answer/answer';
import {supabase} from '../../../environments/environment';
import {Attempts} from '../../models/attempts/attempts';
import {TablesInsert} from '../../../environments/supabase';
import {AttemtpsAnswers} from '../../models/attempts-answers/attempts-answers';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AttemptsAnswersService {
  public getAllAnswersQuiz: AttemtpsAnswers[]  = []
  // public  recoverAnswersUser = new BehaviorSubject<Attempts[]>([]);
  public recoverAnswersUser = new BehaviorSubject<AttemtpsAnswers[]>([]);


  public async insertAttemptAnswers(attemptsAnswers: { [p: number]: Answers }) {

    const insertAttemptAnswers = Object.values(attemptsAnswers).map(answers => ({
      user_id: '22ce5a89-1db2-46e7-a265-c929697ff1d0',
      question_id: answers.question_id,
      selected_answer_id: answers.id,
      quiz_id: answers.quiz_id,
    }))

    const {  } = await supabase
      .from('attempt_answers')
      .insert(
        insertAttemptAnswers
      )
      .select()
  }

  public async getAttemptsAnswers(quiz_id: string | undefined) {

    const { data, error } = await supabase
      .from('attempt_answers')
      .select('*')
      .eq('quiz_id', quiz_id)
    if (error) {
      console.error("erreur sur l'insertion des answers", error);
    }
    else {
      this.getAllAnswersQuiz = data ;
    }
  }

  public async matchAnswersUser(answers_user: AttemtpsAnswers[] | undefined, answers_correct: { [p: number]: Answers }) {
    const answers_quiz = Object.values(answers_correct);
    const answers_user_length = answers_user?.length ?? 0;
    for (let i = 0; i < answers_user_length; i++) {
      if (answers_user) {
        const { data  , error } = await supabase
          .from('answers')
          .select('*')
          // .eq('is_correct', answers_quiz[i].is_correct)
          .eq('id', answers_user[i].selected_answer_id)
        if (error) {
          console.error("erreur sur le match is correct", error);
        }
        else {
          if (data && data[0]?.id) {
            this.recoverAnswersUser.next([
              ...this.recoverAnswersUser.value,
              data[0]
            ]);
          }
        }
      }
    }
  }

  // public async insertAttempts(total: number, quiz_id: string | undefined) {
  //
  //   const newAttempts:TablesInsert<'attempts'> ={
  //     quiz_id: quiz_id ?? null,
  //     score: this.recoverAnswersUser.value.length,
  //     total: total,
  //     user_id: '22ce5a89-1db2-46e7-a265-c929697ff1d0',
  //     created_at: new Date().toISOString(),
  //   };
  //   console.log("newAttempts", newAttempts);
  //   console.log("score", this.recoverAnswersUser.value);
  //   const { error } = await supabase
  //     .from('attempts')
  //     .insert(
  //      newAttempts
  //     )
  //     .select()
  //   if (error) {
  //     console.error("erreur sur l'insertion des attempts", error);
  //   }
  // }

  public async insertAttempts(total: number, quiz_id: string | null | undefined) {
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

    const correctCount = correctAnswers.filter(a => a.is_correct).length;

    const newAttempts: Attempts = {
      quiz_id: quiz_id ?? null,
      score: correctCount,
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
      attempt_id: insertedAttempt.id,
    }));

    const { error: answersError } = await supabase
      .from('attempt_answers')
      .insert(attemptAnswers);

    if (answersError) {
      console.error("Erreur sur l'insertion des attempt_answers", answersError);
    } else {
      console.log("Réponses insérées :", attemptAnswers);
      this.recoverAnswersUser.next([]);
    }
  }


}
