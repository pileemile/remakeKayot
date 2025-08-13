import {Component, OnInit} from '@angular/core';
import {QuizzesService} from '../../service/quizzes/quizzes-service';

@Component({
  selector: 'app-pagination',
  imports: [],
  templateUrl: './pagination.html',
  styleUrl: './pagination.css'
})
export class Pagination implements OnInit{
  constructor(
    private quizzesService: QuizzesService,
  ) {}

  async ngOnInit() {
    // await this.quizzesService.paginationQuizzes(1,10)
    // console.log(this.quizzesService.allQuizzes$.value)
  }

}
