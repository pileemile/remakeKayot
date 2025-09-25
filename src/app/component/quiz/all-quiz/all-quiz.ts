import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {QuizService} from '../../../service/quiz/quiz-service';
import {Pagination} from '../../pagination/pagination';
import {TableAction, TableColumn} from '../../../models/tables/tables-interface';
import {Table} from '../../table/table';
import {PaginationType} from '../../pagination/constent';

@Component({
  selector: 'app-all-quiz',
  imports: [
    Pagination,
    Table,
    Pagination
  ],
  templateUrl: './all-quiz.html',
  styleUrl: './all-quiz.css'
})
export class AllQuiz {
  protected readonly PaginationType = PaginationType;

  constructor(
    private readonly allQuizService: QuizService,
    private readonly router: Router,
  ) {}

  public tableColumns: TableColumn[] = [
    { key: 'title', label: 'Titre', type: 'text' },
    { key: 'description', label: 'Description', type: 'text' },
    { key: 'questionCount', label: 'Nombre de questions', type: 'number' },
    { key: 'created_at', label: 'Date de création', type: 'date' },
    { key: 'actions', label: 'Actions', type: 'action' }
  ];

  public tableActions: TableAction[] = [
    {
      label: 'Voir',
      icon: 'arrow-right',
      handler: (quiz) => this.getQuizByIdLoad(quiz.id)
    },
    // {
    //   label: 'Modifier',
    //   icon: 'edit',
    //   handler: (quiz) => this.editQuiz(quiz.id)
    // }
  ];

  public get all_quiz() {
    const all_quiz = this.allQuizService.allQuizs$.value;

    if (!all_quiz) {
      return null;
    }
    return all_quiz.map(quiz => ({
      ...quiz,
      questionCount: quiz.questions?.length || 0
    }));
  }

  public getQuizByIdLoad(id: string) {
   this.router.navigate(['/answer-quiz/' + id]).then();
  }

  private editQuiz(quiz: any) {
  }

}
