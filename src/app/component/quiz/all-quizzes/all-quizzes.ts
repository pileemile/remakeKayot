import {Component, OnInit} from '@angular/core';
import {Category,} from '../../../models/quizzes/quizzes';
import {Router} from '@angular/router';
import {QuizzesService} from '../../../service/quizzes/quizzes-service';

@Component({
  selector: 'app-all-quizzes',
  imports: [],
  templateUrl: './all-quizzes.html',
  styleUrl: './all-quizzes.css'
})
export class AllQuizzes implements OnInit{
  public Category = Category;

  constructor(
    public allQuizzesService: QuizzesService,
    private router: Router,
  ) {}

 async ngOnInit() {
    await this.allQuizzesService.getAllQuizzes();
  }

public async getQuizById(id: string) {
  await this.allQuizzesService.getQuizzesById(id);
  await this.router.navigate(['/answer-quiz']);

}
}
