import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {QuizService} from '../../../service/quiz/quiz-service';
import {Pagination} from '../../pagination/pagination';
import {TableAction, TableColumn} from '../../../models/tables/tables-interface';
import {Table} from '../../table/table';
import {PaginationType} from '../../pagination/constent';
import {AttemptsService} from '../../../service/attempts/attempts-service';
import {Attempts} from '../../../models/attempts/attempts';
import {Quiz, QuizWithStatus} from '../../../models/quiz/quiz';
import {PaginationService} from '../../../service/pagination/pagination-service';

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
export class AllQuiz implements  OnInit{
  protected readonly PaginationType = PaginationType;
  public allQuizWithStatus: QuizWithStatus[] = [];
  private attemptsUser: Attempts[] = [];

  constructor(
    private readonly quizService: QuizService,
    private readonly router: Router,
    private readonly attemptsService: AttemptsService,
    private readonly paginationService: PaginationService,
  ) {}

  ngOnInit() {
    this.loadData().then();
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
      handler: (quiz) => this.getQuizByIdLoad(quiz.id),
      disabled: (quiz) => this.attemptsUser.some(a => a.quiz_id === quiz.id && a.isCompleted)
    },
    // {
    //   label: 'Modifier',
    //   icon: 'edit',
    //   handler: (quiz) => this.editQuiz(quiz.id)
    // }
  ];

  public get all_quiz() {
    const all_quiz = this.quizService.allQuizs$.value;
    const attempts = this.attemptsService.attemptsAllWithUser$.value;
    console.log("all_quiz", all_quiz);

    if (!all_quiz) {
      return null;
    }

    const attemptedQuizIds = new Set(attempts?.map(attempt => attempt.quiz_id) || []);

    return all_quiz.map(quiz => ({
      ...quiz,
      questionCount: quiz.questions?.length || 0,
      isCompleted: attemptedQuizIds.has(quiz.id)
    }));
  }

  public getQuizByIdLoad(id: string) {
    this.router.navigate(['/answer-quiz/' + id]).then();
  }

  private async loadData() {
    const userId = '22ce5a89-1db2-46e7-a265-c929697ff1d0';

    await this.quizService.getAllQuiz();

    await this.attemptsService.matchAttemptsQuiz(userId);

    const quizzes = this.quizService.allQuizs$.value ?? [];
    this.attemptsUser = this.attemptsService.attemptsAllWithUser$.value ?? [];

    this.allQuizWithStatus = quizzes.map((quiz: Quiz) => {
      const attempt = this.attemptsUser.find(a => a.quiz_id === quiz.id);
      const isAttempted = !!attempt;
      const isCompleted = attempt?.isCompleted ?? false;

      return {
        ...quiz,
        questionCount: quiz.questions?.length ?? 0,
        isAttempted,
        isCompleted
      };
    });
  }

}
