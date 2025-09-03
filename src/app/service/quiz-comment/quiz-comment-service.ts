import { Injectable } from '@angular/core';
import {supabase} from '../../../environments/environment';
import {QuizComment} from '../../models/quiz-comment/quiz-comment';
import {TablesInsert} from '../../../environments/supabase';

@Injectable({
  providedIn: 'root'
})
export class QuizCommentService {
  private readonly currentUserId = '22ce5a89-1db2-46e7-a265-c929697ff1d0';

  public async getCommentsByQuizId(quizId: string): Promise<QuizComment[]> {
    const { data, error } = await supabase
      .from('quiz_comments')
      .select('*')
      .eq('quiz_id', quizId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des commentaires:', error);
      throw error;
    }

    return data || [];
  }

  public async addComment(quizId: string, text: string): Promise<QuizComment> {
    const newComment: TablesInsert<'quiz_comments'> = {
      quiz_id: quizId,
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
      console.error('Erreur lors de l\'ajout du commentaire:', error);
      throw error;
    }

    return data;
  }

  public async deleteComment(commentId: string): Promise<void> {
    const { error } = await supabase
      .from('quiz_comments')
      .delete()
      .eq('id', commentId)
      .eq('user_id', this.currentUserId);

    if (error) {
      console.error('Erreur lors de la suppression du commentaire:', error);
      throw error;
    }
  }

  public async updateComment(commentId: string, text: string): Promise<QuizComment> {
    const { data, error } = await supabase
      .from('quiz_comments')
      .update({ text })
      .eq('id', commentId)
      .eq('user_id', this.currentUserId)
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la modification du commentaire:', error);
      throw error;
    }

    return data;
  }
}
