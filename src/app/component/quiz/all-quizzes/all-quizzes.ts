import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {QuizzesService} from '../../../service/quizzes/quizzes-service';
import {PaginationService} from '../../../service/pagination/pagination-service';
import {Pagination} from '../../pagination/pagination';
import {TableAction, TableColumn} from '../../../models/tables/tables-interface';
import {Table} from '../../table/table';
import {PaginationType} from '../../pagination/constent';

@Component({
  selector: 'app-all-quizzes',
  imports: [
    Pagination,
    Table
  ],
  templateUrl: './all-quizzes.html',
  styleUrl: './all-quizzes.css'
})
export class AllQuizzes implements OnInit{
  constructor(
    private allQuizzesService: QuizzesService,
    private router: Router,
    private paginationService: PaginationService,
  ) {}

 async ngOnInit() {
   await this.paginationService.paginationQuizzes(this.paginationService.pagination$.value?.page, this.paginationService.pagination$.value?.limit);

 }
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

  public get all_quizzes() {
    const allQuizzes = this.allQuizzesService.allQuizzes$.value;

    if (!allQuizzes) {
      return null;
    }
    return allQuizzes.map(quiz => ({
      ...quiz,
      questionCount: quiz.questions?.length || 0
    }));
  }

  public async getQuizByIdLoad(id: string) {
  await this.allQuizzesService.getQuizById(id);
  await this.router.navigate(['/answer-quiz/' + id]);

  }

  public async viewComments(id: string) {
    await this.allQuizzesService.getQuizById(id);
    await this.router.navigate(['/answer-quiz/' + id]);
  }

  private viewQuiz(quiz: any) {
    console.log('Voir quiz:', quiz);
  }

  private editQuiz(quiz: any) {
    console.log('Modifier quiz:', quiz);
  }

  protected readonly PaginationType = PaginationType;
}
