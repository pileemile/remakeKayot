import { Injectable } from '@angular/core';
import {Answers} from '../../models/answer/answer';
import {supabase} from '../../../environments/environment';
import {Attempts} from '../../models/attempts/attempts';
import {TablesInsert} from '../../../environments/supabase';
import {AttemtpsAnswers} from '../../models/attempts-answers/attempts-answers';

@Injectable({
  providedIn: 'root'
})
export class AttemptsAnswersService {
  public getAllAnswersQuiz: AttemtpsAnswers[]  = []
  public  recoverAnswersUser: Attempts[] = []


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
            this.recoverAnswersUser.push(data[0]?.id)
          }
        }
      }
    }
  }

  public async insertAttempts(total: number, quiz_id: string | undefined) {

    const newAttempts:TablesInsert<'attempts'> ={
      quiz_id: quiz_id ?? null,
      score: this.recoverAnswersUser.length,
      total: total,
      user_id: '22ce5a89-1db2-46e7-a265-c929697ff1d0',
      created_at: new Date().toISOString(),
    };
    const { data, error } = await supabase
      .from('attempts')
      .insert(
       newAttempts
      )
      .select()
    if (error) {
      console.error("erreur sur l'insertion des attempts", error);
    }
  }
}
