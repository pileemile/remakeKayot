import {inject, Injectable} from '@angular/core';
import {environment, supabase} from '../../../environments/environment';
import {QuizComment} from '../../models/quiz-comment/quiz-comment';
import {TablesInsert} from '../../../environments/supabase';
import {Quizzes} from '../../models/quizzes/quizzes';
import {QuizzesService} from '../quizzes/quizzes-service';
import {BehaviorSubject, lastValueFrom} from 'rxjs';
import {QuizComments} from '../../component/quiz/quiz-comments/quiz-comments';
import {UserModele} from '../../models/user/user-modele';
import {HttpClient, HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class QuizCommentService {

  constructor(
    private quizzesService: QuizzesService,
  ) {}

  public comments = new BehaviorSubject<QuizComment[]>([])
  public commentUser = new BehaviorSubject<QuizComment[]>([])
  public commentByQuiz: QuizComment[] = [];

  //todo: l'enlever après
  private currentUserId = '22ce5a89-1db2-46e7-a265-c929697ff1d0';
  //TODO: les variables sont peut être au bonne endroit
  private apiUrl = environment.supabaseUrl + '/rest/v1';
  private http = inject(HttpClient);

  public async getCommentsByQuizId(quizId: Quizzes) {
    try {
      const { data, error } = await supabase
        .from('quiz_comments')
        .select('*')
        .eq('quiz_id', quizId.id);

      if (error) {
        console.error('Erreur Supabase:', error);
        throw error;
      }

      console.log('Succès', data);
      return data || [];
    } catch (error) {
      console.error('Erreur inattendue:', error);
      throw error;
    }
  }


  public async addComment(quizId: Quizzes, text: string) {
    const { data, error } = await supabase
      .from('quiz_comments')
      .insert({
        quiz_id: quizId.id,
        user_id: this.currentUserId,
        text: text,
        created_at: new Date().toISOString()
      })
      .select()
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

  public async getAllCommentsByUserId(userId: string) {
    const { data, error } = await supabase
    .from('quiz_comments')
    .select('*')
    .eq('user_id', userId);

    if (error) {
      console.error('Erreur récupération des commentaires:', error);
    }
    return data || [];
  }

  public async getAllCommentsByQuiz(quizId: Quizzes[] | null) {
    if(quizId === null) return [];

    const filterQuizId = quizId.map(quiz => quiz.id);

    const { data, error } = await supabase
    .from('quiz_comments')
    .select('*')
    .in('quiz_id', filterQuizId);

    if (error){
      console.log("erreur sur la récupération des commentaires", error);
    }
    return data || [];
  }

  public async loadCommentsByQuiz() {
    try {
      if (this.quizzesService.quiz$.value) {
        this.comments.next(await this.getCommentsByQuizId(this.quizzesService.quiz$.value));
      }
    } catch (error) {
      console.error('Erreur chargement des commentaires:', error);
    }
  }

  public async loadCommentByUser() {
    try {
      if (this.currentUserId) {
        this.commentUser.next(await this.getAllCommentsByUserId(this.currentUserId));
      }
    } catch (error) {
      console.error('Erreur chargement des commentaires:', error);
    }
  }

  public async getCommentByQuizId(quizId: string){
    const { data, error } = await supabase
      .from('quiz_comments')
      .select('*')
      .eq('quiz_id', quizId);

    if (error){
      console.log("erreur de la récupération des commentaires", error);
    }
    this.commentByQuiz = data || [];
    return data || [];
  }
}
