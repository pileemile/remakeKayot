import { Component } from '@angular/core';
import {UserDetails} from '../../component/user/user-details/user-details';
import {Table} from '../../component/table/table';
import {UserService} from '../../service/user/user';
import {TableColumn} from '../../models/tables/tables-interface';
import {UserComments} from '../../component/user/user-comments/user-comments';
import {Pagination} from '../../component/pagination/pagination';
import {PaginationType} from '../../component/pagination/constent';
import {QuizService} from '../../service/quiz/quiz-service';
import {StreakCardComponent} from '../../component/streaks/streak-card/streak-card';

@Component({
  selector: 'app-user-profil',
  imports: [
    UserDetails,
    Table,
    UserComments,
    Pagination,
    StreakCardComponent
  ],
  templateUrl: './user-profil.html',
  styleUrl: './user-profil.css'
})
export class UserProfil {
  protected readonly PaginationType = PaginationType;

  public user_id: string = '22ce5a89-1db2-46e7-a265-c929697ff1d0';

  public tableColumns: TableColumn[] = [
    { key: 'title', label: 'Titre', type: 'text' },
    { key: 'description', label: 'Description', type: 'text' },
    { key: 'category', label: 'Category', type: 'text' },
    { key: 'difficulty', label: 'Difficulty', type: 'text' },
  ];

  constructor(
    private readonly userService: UserService,
    private readonly quizService: QuizService,
  ) {}

  public get userQuiz() {
    console.log("userQuiz", this.userService.userByQuiz.value);
    return this.userService.userByQuiz.value;
  }
  public get paginatedQuizzes() {
    return this.quizService.allQuizs$.value;
  }
}
