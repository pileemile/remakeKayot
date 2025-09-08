import { Injectable } from '@angular/core';
import {supabase} from '../../../environments/environment';
import {QuizComment} from '../../models/quiz-comment/quiz-comment';
import {TablesInsert} from '../../../environments/supabase';
import {Quizzes} from '../../models/quizzes/quizzes';
import {QuizzesService} from '../quizzes/quizzes-service';
import {BehaviorSubject} from 'rxjs';
import {QuizComments} from '../../component/quiz/quiz-comments/quiz-comments';
import {UserModele} from '../../models/user/user-modele';

@Injectable({
  providedIn: 'root'
})
export class QuizCommentService {

  constructor(
    private quizzesService: QuizzesService,
  ) {}

  public comments = new BehaviorSubject<QuizComment[]>([])
  public commentUser = new BehaviorSubject<QuizComment[]>([])

  //todo: l'enlever après
  private currentUserId = '22ce5a89-1db2-46e7-a265-c929697ff1d0';

  public async getCommentsByQuizId(quizId: Quizzes) {
    const { data, error } = await supabase
      .from('quiz_comments')
      .select('*')
      .eq('quiz_id', quizId.id)

    if (error) {
      console.error('Erreur récupération des commentaires:', error);
      throw error;
    }

    return data || [];
  }

  public async addComment(quizId: Quizzes, text: string) {
    const newComment: TablesInsert<'quiz_comments'> = {
      quiz_id: quizId.id,
      user_id: this.currentUserId,
      text: text,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('quiz_comments')
      .insert([newComment])
      .select()
      .single();

    if (error) {
      console.error('Erreur ajout du commentaire:', error);
      throw error;
    }

    return data;
  }

  public async deleteComment(commentId: string) {
    const { error } = await supabase
      .from('quiz_comments')
      .delete()
      .eq('id', commentId)
      .eq('user_id', this.currentUserId);

    if (error) {
      console.error('Erreur suppression du commentaire:', error);
      throw error;
    }
  }

  public async updateComment(commentId: string, text: string) {
    const { data, error } = await supabase
      .from('quiz_comments')
      .update({ text })
      .eq('id', commentId)
      .eq('user_id', this.currentUserId)
      .select()
      .single();

    if (error) {
      console.error('Erreur modification du commentaire:', error);
      throw error;
    }
    return data;
  }

  public async getAllCommentsByUser(userId: string) {
    const { data, error } = await supabase
    .from('quiz_comments')
    .select('*')
    .eq('user_id', userId);

    if (error) {
      console.error('Erreur récupération des commentaires:', error);
    }
    console.log("data", data);

    return data || [];
  }

  public async loadCommentsByQuiz() {
    try {
      if (this.quizzesService.quizzesId$.value) {
        this.comments.next(await this.getCommentsByQuizId(this.quizzesService.quizzesId$.value));
      }
    } catch (error) {
      console.error('Erreur chargement des commentaires:', error);
    }
  }

  public async loadCommentByUser() {
    try {
      if (this.currentUserId) {
        this.commentUser.next(await this.getAllCommentsByUser(this.currentUserId));
      }
    } catch (error) {
      console.error('Erreur chargement des commentaires:', error);
    }
  }
}
