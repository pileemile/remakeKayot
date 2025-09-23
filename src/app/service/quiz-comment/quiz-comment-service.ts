import {Injectable} from '@angular/core';
import {supabase} from '../../../environments/environment';
import {Comment} from '../../models/quiz-comment/quiz-comment';
import {Quiz} from '../../models/quiz/quiz';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuizCommentService {


  public comments = new BehaviorSubject<Comment[]>([])
  public commentUser = new BehaviorSubject<Comment[]>([])
  public commentByQuiz = new BehaviorSubject<{ [quizId: string]: Comment[] }>({});
  public quizIdForComment: string | null = null;

  private readonly isLoading = new BehaviorSubject<boolean>(false);

  //todo: l'enlever après
  private readonly currentUserId = '22ce5a89-1db2-46e7-a265-c929697ff1d0';


  public async getCommentsByQuizId(quizId: string | null) {
    try {
      const { data, error } = await supabase
        .from('quiz_comments')
        .select('*')
        .eq('quiz_id', quizId);

      if (error) {
        console.error('Erreur Supabase:', error);
        throw error;
      }

      console.log('Succès', data);
      this.comments.next(data);
      return data || [];
    } catch (error) {
      console.error('Erreur inattendue:', error);
      throw error;
    }
  }

  public async addComment(quizId: string, text: string) {
     await supabase
      .from('quiz_comments')
      .insert({
        quiz_id: quizId,
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

  public async getAllCommentsByQuiz(quizId: Quiz[] | null) {
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
         this.comments.next(await this.getCommentsByQuizId(this.quizIdForComment));
        console.log("commentaires", this.comments.value);

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

  public async getCommentByQuizId(quizId: string): Promise<Comment[]> {
    this.isLoading.next(true);
    try {
      const { data, error } = await supabase
        .from('quiz_comments')
        .select('*')
        .eq('quiz_id', quizId);

      if (error) {
        console.error("Erreur lors de la récupération des commentaires :", error);
        return [];
      }
      const currentComments = this.commentByQuiz.value;

      this.commentByQuiz.next({
        ...currentComments,
        [quizId]: data || []
      });

      return data || [];
    } finally {
      this.isLoading.next(false);
    }
  }


  getCommentsForQuiz(quizId: string): Comment[] {
    console.log("commentByQuiz", this.commentByQuiz.value)
    return this.commentByQuiz.value[quizId] || [];
  }

  get loading(): boolean {
    return this.isLoading.value;
  }
}
